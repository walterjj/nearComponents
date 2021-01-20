/** Class to realize fetch interceptors */
class FetchInterceptor {
  constructor() {
    this.interceptors = [];

    /* global fetch */
    this.fetch = (...args) => this.interceptorWrapper(fetch, ...args);
  }

  /**
   * add new interceptors
   * @param {(Object|Object[])} interceptors
   */
  addInterceptors(interceptors) {
    const removeIndex = [];

    if (Array.isArray(interceptors)) {
      interceptors.map((interceptor) => {
        removeIndex.push(this.interceptors.length);
        return this.interceptors.push(interceptor);
      });
    } else if (interceptors instanceof Object) {
      removeIndex.push(this.interceptors.length);
      this.interceptors.push(interceptors);
    }

    this.updateInterceptors();

    return () => this.removeInterceptors(removeIndex);
  }

  /**
   * remove interceptors by indexes
   * @param {number[]} indexes
   */
  removeInterceptors(indexes) {
    if (Array.isArray(indexes)) {
      indexes.map(index => this.interceptors.splice(index, 1));
      this.updateInterceptors();
    }
  }

  /**
   * @private
   */
  updateInterceptors() {
    this.reversedInterceptors = this.interceptors
      .reduce((array, interceptor) => [interceptor].concat(array), []);
  }

  /**
   * remove all interceptors
   */
  clearInterceptors() {
    this.interceptors = [];

    this.updateInterceptors();
  }

  /**
   * @private
   */
  interceptorWrapper(fetch, ...args) {
    let promise = Promise.resolve(args);

    this.reversedInterceptors.forEach(({ request, requestError }) => {
      if (request || requestError) {
        promise = promise.then(() => request(...args), requestError);
      }
    });

    promise = promise.then(() => fetch(...args));

    this.reversedInterceptors.forEach(({ response, responseError }) => {
      if (response || responseError) {
        promise = promise.then(response, responseError);
      }
    });

    return promise;
  }
}

/**
 * GraphQL client with fetch api.
 * @extends FetchInterceptor
 */
class FetchQL extends FetchInterceptor {
  /**
   * Create a FetchQL instance.
   * @param {Object} options
   * @param {String} options.url - the server address of GraphQL
   * @param {(Object|Object[])=} options.interceptors
   * @param {{}=} options.headers - request headers
   * @param {FetchQL~requestQueueChanged=} options.onStart - callback function of a new request queue
   * @param {FetchQL~requestQueueChanged=} options.onEnd - callback function of request queue finished
   * @param {Boolean=} options.omitEmptyVariables - remove null props(null or '') from the variables
   * @param {Object=} options.requestOptions - addition options to fetch request(refer to fetch api)
   */
  constructor({
     url,
     interceptors,
     headers,
     onStart,
     onEnd,
     omitEmptyVariables = false,
     requestOptions = {},
  }) {
    super();

    this.requestObject = Object.assign(
      {},
      {
        method: 'POST',
        headers: Object.assign({}, {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }, headers),
        credentials: 'same-origin',
      },
      requestOptions,
    );

    this.url = url;

    this.omitEmptyVariables = omitEmptyVariables;

    // marker for request queue
    this.requestQueueLength = 0;

    // using for caching enums' type
    this.EnumMap = {};

    this.callbacks = {
      onStart,
      onEnd,
    };

    this.addInterceptors(interceptors);
  }

  /**
   * operate a query
   * @param {Object} options
   * @param {String} options.operationName
   * @param {String} options.query
   * @param {Object=} options.variables
   * @param {Object=} options.opts - addition options(will not be passed to server)
   * @param {Boolean=} options.opts.omitEmptyVariables - remove null props(null or '') from the variables
   * @param {Object=} options.requestOptions - addition options to fetch request(refer to fetch api)
   * @returns {Promise}
   * @memberOf FetchQL
   */
  query({ operationName, query, variables, opts = {}, requestOptions = {}, }) {
    const options = Object.assign({}, this.requestObject, requestOptions);
    let vars;
    if (this.omitEmptyVariables || opts.omitEmptyVariables) {
      vars = this.doOmitEmptyVariables(variables);
    } else {
      vars = variables;
    }
    const body = {
      operationName,
      query,
      variables: vars,
    };
    options.body = JSON.stringify(body);

    this.onStart();

    return this.fetch(this.url, options)
      .then((res) => {
        if (res.ok) {
          
          //res.json().then(text=>console.log(text))
          return res.json();
        }
        // return an custom error stack if request error
        return {
          errors: [{
            message: res.statusText,
            stack: res,
          }],
        };
      })
      .then(({ data, errors ,extensions}) => (
        
        new Promise((resolve, reject) => {
          console.log("extensions",extensions)
          this.onEnd();

          // if data in response is 'null'
          //if (!data) {
           // return reject(errors || [{}]);
          //}
          // if all properties of data is 'null'
          const allDataKeyEmpty = Object.keys(data).every(key => !data[key]);
          //if (allDataKeyEmpty) {
          // return reject(errors);
          //}
          return resolve({ data, errors });
        })
      ));
  }

  /**
   * get current server address
   * @returns {String}
   * @memberOf FetchQL
   */
  getUrl() {
    return this.url;
  }

  /**
   * setting a new server address
   * @param {String} url
   * @memberOf FetchQL
   */
  setUrl(url) {
    this.url = url;
  }

  /**
   * get information of enum type
   * @param {String[]} EnumNameList - array of enums' name
   * @returns {Promise}
   * @memberOf FetchQL
   */
  getEnumTypes(EnumNameList) {
    const fullData = {};

    // check cache status
    const unCachedEnumList = EnumNameList.filter((element) => {
      if (this.EnumMap[element]) {
        // enum has been cached
        fullData[element] = this.EnumMap[element];
        return false;
      }
      return true;
    });

    // immediately return the data if all enums have been cached
    if (!unCachedEnumList.length) {
      return new Promise((resolve) => {
        resolve({ data: fullData });
      });
    }

    // build query string for uncached enums
    const EnumTypeQuery = unCachedEnumList.map(type => (
      `${type}: __type(name: "${type}") {
        ...EnumFragment
      }`
    ));

    const query = `
      query {
        ${EnumTypeQuery.join('\n')}
      }
      
      fragment EnumFragment on __Type {
        kind
        description
        enumValues {
          name
          description
        }
      }`;

    const options = Object.assign({}, this.requestObject);
    options.body = JSON.stringify({ query });

    this.onStart();

    return this.fetch(this.url, options)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        // return an custom error stack if request error
        return {
          errors: [{
            message: res.statusText,
            stack: res,
          }],
        };
      })
      .then(({ data, errors }) => (
        new Promise((resolve, reject) => {
          this.onEnd();

          // if data in response is 'null' and have any errors
          if (!data) {
            return reject(errors || [{ message: 'Do not get any data.' }]);
          }
          // if all properties of data is 'null'
          const allDataKeyEmpty = Object.keys(data).every(key => !data[key]);
          if (allDataKeyEmpty && errors && errors.length) {
            return reject(errors);
          }
          // merge enums' data
          const passData = Object.assign(fullData, data);
          // cache new enums' data
          Object.keys(data).map((key) => {
            this.EnumMap[key] = data[key];
            return key;
          });
          return resolve({ data: passData, errors });
        })
      ));
  }

  /**
   * calling on a request starting
   * if the request belong to a new queue, call the 'onStart' method
   */
  onStart() {
    this.requestQueueLength++;
    if (this.requestQueueLength > 1 || !this.callbacks.onStart) {
      return;
    }
    this.callbacks.onStart(this.requestQueueLength);
  }

  /**
   * calling on a request ending
   * if current queue finished, calling the 'onEnd' method
   */
  onEnd() {
    this.requestQueueLength--;
    if (this.requestQueueLength || !this.callbacks.onEnd) {
      return;
    }
    this.callbacks.onEnd(this.requestQueueLength);
  }

  /**
   * Callback of requests queue changes.(e.g. new queue or queue finished)
   * @callback FetchQL~requestQueueChanged
   * @param {number} queueLength - length of current request queue
   */

  /**
   * remove empty props(null or '') from object
   * @param {Object} input
   * @returns {Object}
   * @memberOf FetchQL
   * @private
   */
  doOmitEmptyVariables(input) {
    const nonEmptyObj = {};
    Object.keys(input).map(key => {
      const value = input[key];
      if ((typeof value === 'string' && value.length === 0) || value === null || value === undefined) {
        return key;
      } else if (value instanceof Object) {
        nonEmptyObj[key] = this.doOmitEmptyVariables(value);
      } else {
        nonEmptyObj[key] = value;
      }
      return key;
    });
    return nonEmptyObj;
  }
}

export default FetchQL;
