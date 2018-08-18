const Meetup = require('../models/Meetup');

module.exports = {
    checkUserMeetup: function(req, res, next) {
        Meetup.findById({_id: req.params.id}, (err, foundMeetup) => {
            if(err || !foundMeetup){
                console.log(err);
                req.flash('No meetup found');
                res.redirect('/meetups');                
            }
            else if(foundMeetup.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
            }
            else{
                req.flash('error', 'You don\'t have permission to do that!');
                res.redirect('/meetup/' + req.params.id);
            }
        })
        
    }
}