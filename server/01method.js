if(Meteor.isServer){
    Meteor.methods({
        getCurrentUser : function(){
            return UserLocations.findOne({connectionId : this.connection.id})
        },
        updateUserConnection : function (c) {
            check(c.id, String);
            check(c.clientAddress,String);
            check(c.httpHeaders,Object);

            var rs = UserLocations.upsert({ipAddress : c.clientAddress},{
                $set : {
                    connectionId : c.id,
                    ipAddress : c.clientAddress,
                    httpHeaders : EJSON.stringify(c.httpHeaders)
                }
            });

        },
        updateUserLocation : function ( params) {
            check(params, Object);
            UserLocations.upsert({connectionId : this.connection.id},{
                $set : params
            });
        }
    })
}