'use strict';

// fetches data from the OpenPhacts API
// return promises so that the caller can chain async with .then()

app.factory('OpenPhacts', function ($http, OPAPI_URL, OPAPI_APPKEY) {

    var OpenPhacts = {
        //return the first URI found in OpenPhacts for a given term
        getURI: function (term) {
            var url = OPAPI_URL+"search/freetext?"+OPAPI_APPKEY+"&_format=json&q="+term;
            return $http.get(url).then(function (output) {
                return output.data.result.primaryTopic.result[0]._about;
            });
        },
        //get compound info from a compound URI
        getCompound: function (compoundURI) {
            var url = OPAPI_URL+"compound?"+OPAPI_APPKEY+"&_format=json&uri="+encodeURIComponent(compoundURI);
            return $http.get(url).then(function (output) {
                var result = {};
                //set explicit attributes for each datasource to avoid relying on array indexes
                angular.forEach(output.data.result.primaryTopic.exactMatch, function(value, key){
                   switch (value.inDataset)
                   {
                   case "http://linkedlifedata.com/resource/drugbank":
                       result.drugbank = value;
                   break;
                   case "http://ops.rsc.org":
                       result.ChEMBL = value;
                   break;
                   }
                });
                return result;
            });
        },
        //get pharmacology info for a given compound - returns an array of activities
        getCompoundPharmacology: function (compoundURI, filterForType) {
            var filter = "";
            var url = "";
            if(filterForType){
                filter = "activity_type="+filterForType+"&";
            }
            url = OPAPI_URL+"compound/pharmacology/pages?_pageSize=100&"+filter+OPAPI_APPKEY+"&_format=json&uri="+encodeURIComponent(compoundURI);
            return $http.get(url).then(function (output) {
                var result = output.data.result.items;
                return result;
            });
        }
    };

    return OpenPhacts;
  });
