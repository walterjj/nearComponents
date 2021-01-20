/** ****************************************************************************************************
 * File: encode.js
 * Project: geohash
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 19-Feb-2019
 *******************************************************************************************************/
'use strict';


const
BASE32         = '0123456789bcdefghjkmnpqrstuvwxyz',
ENCODE_AUTO    = -1,
MIN_LNG        = -180,
MIN_LAT        = -90,
MAX_LNG        = 180,
MAX_LAT        = 90;



/**
 * encode
 * Encodes latitude/longitude to geohash, either to specified precision or to automatically
 * evaluated precision.
 *
 * @param   {number} lng - Longitude in degrees.
 * @param   {number} lat - Latitude in degrees.
 * @param   {number} [precision] - Number of characters in resulting geohash.
 * @returns {string} Geohash of supplied latitude/longitude.
 * @throws  Invalid geohash.
 *
 * @example
 *     const geohash = Geohash.encode(52.205, 0.119, 7); // geohash: 'u120fxw'
 */
export function encode( lng, lat, precision =7 ) {
	//precision = determinePrecision( lng, lat, precision );

	lat       = +lat;
	lng       = +lng;
	precision = +precision;

	if( !( lat && lat === lat ) ||
		!( lng && lng === lng ) ||
		!( precision && precision === precision ) ) {
		throw new Error( 'Invalid geohash' );
	}

	let
		geohash = '',
		hash    = 0, // index into BASE32 map
		bit     = 0, // each char holds 5 bits
		evenBit = true,
		lngMin  = MIN_LNG,
		latMin  = MIN_LAT,
		lngMax  = MAX_LNG,
		latMax  = MAX_LAT,
		mid     = 0;

	while( geohash.length < precision ) {
		if( evenBit ) {
			// bisect E-W longitude
			mid = ( lngMin + lngMax ) / 2;
			if( lng >= mid ) {
				hash   = ( hash << 1 ) + 1;
				lngMin = mid;
			} else {
				hash   = hash << 1;
				lngMax = mid;
			}
		} else {
			// bisect N-S latitude
			mid = ( latMin + latMax ) / 2;
			if( lat >= mid ) {
				hash   = ( hash << 1 ) + 1;
				latMin = mid;
			} else {
				hash   = hash << 1;
				latMax = mid;
			}
		}

		evenBit = !evenBit;

		if( ++bit === 5 ) {
			// 5 bits gives us a character: append it and start over
			geohash += BASE32[ hash ];
			bit  = 0;
			hash = 0;
		}
	}

	return geohash;
}
