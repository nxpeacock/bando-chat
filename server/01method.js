if(Meteor.isServer){
    Meteor.methods({
        createGuestUser : function(){
            var guest = Fake.user({fields: ['fullname', 'email', 'username']}),
                c = this.connection,
            guest = _.extend(guest, {
                password: c.id,
                roles: ['guest'],
                profile: {
                    fullName: guest.fullname,
                    token: c.id,
                    ipAddress : c.clientAddress,
                    gender: _.random(0, 1)
                }
            });
            var guestId = Accounts.createUser({
                username: guest.username,
                email: guest.email,
                password: guest.password,
                profile: guest.profile
            });

            Meteor.users.update({_id: guestId}, {
                $set: {
                    'emails.0.verified': true
                }
            });

            Roles.addUsersToRoles(guestId, guest.roles);
            return {
                username: guest.username,
                token: guest.password
            };
        },
        updateUserLocation : function (params) {
            var user = Meteor.users.findOne({_id : this.userId}),
                c = this.connection;
            if(user){
                var profile = _.extend(user.profile,{ipAddress : c.clientAddress});

                Meteor.users.update({_id : user._id},{
                    $set : {
                        profile : profile
                    }
                });

                UserLocations.upsert({userId : user._id},{
                    $set : {
                        userId : user._id,
                        latlng : params.latlng,
                        radius : params.radius
                    }
                })
            }
        },
        removeUserLocation : function(userId){
            var userId = userId || this.userId;
            UserLocations.remove({userId : userId});
        }
    })
}