var mongoose   = require("mongoose"),
    Campground = require("./models/campground.js"),
    Comment    = require("./models/comment")

    var data = [
        {name: "Clouds Rest",
        image: "https://lh3.googleusercontent.com/IDVZL5XRlovQmnOcAx5YnOyXkpiy92SUGzxNb-wP1OKfC68MuPfRp62ksmzc6FEWMI_NEcwWxUSmEmoHQ3uMVtaGcXmtT05kjgifmwguUoNVgv7t8L_rR4FiWXCWBcZ4v09FBWS3xyR6ioAMAADFb1d5oOV6AqlNcIrtPdOXdEarrJ_S22aKhe77nbtJZY5DIOBa1VgeV-E5pBJxYWjx7dcUUfh63UG8HoiSFY3bfWe1rg6H-YZunboFZUDSpOG04ZciLRnpLaMIgG0QXaGIZ6hqYxtp52J-hJwaEnp5B00kTJWCs2awxtFwM2MSJWzmyqmQm4eNf5LngSc8i8agvN2RxhO9bGSKEspTgn296-lsQRDruhQsPzruRjBxf0nqNkFDKxD0kVE6xeeOwehStkjl_DT_6FARr_KwJgfqLFXZY_-tErJoznLjaPZ_QghYdkA1aAslZX_-cHxQBdifOmd9u_ArX25hSrJN2GaILHvTErnLSVAELp72FR3TGC9eD0UJPecb1dTxv2-nkGt1631THjLK05kNQB9-BenxkV_IyvL-Pup_4_477T-W2Ek_gV-z2Q5h2tp51hPPmOTgKZvkGno16ydPlAIOKeF4yZTxcMV8kx1vPsoZg1eivn14_qgYoEpHN3mhuc1j_Z3L-VHfRDxVQSLwdZ9GgsBZjb2l5LJlsYclnw_c=w929-h707-no",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    },
    {
        name: "Desert Masa",
        image: "https://lh3.googleusercontent.com/1bwLI7FP8D7yca2i-b3YqMVuGV90OcBLO63xq_5ZwTIrXOREyie9q1zNKGj0qlw19U7pyK3kanAyNmsFUHuVb0XJNB64mtcj_8J4Cx5NVQIKP4QvfgFYCFiDcxOVHsWl8PnGvZNVuT8xw_CHXz_16YMG-yMN3Z7eiwrjnjTUZzhgVpn5Vx5Dw9RzyjO78SsTMbOoxVeGdaL0iWIvccshcmpJYJwxJmsjA7SWvA2INMSXoaCj4cbO8GUWI4W2qrNCLoJkO4bp8hb15YdtEEHs3VU1zYM-h8S9iL4i8dybAeadGuKUheBps4IC6cG4FgsDkXYATOcAKcoUr1HifSOmscSYCfp3fHoPRL4gs30ce_xZmmRv07GTZSibrcxyUgXkctLQ61PigC2_WT_91ZHwe9YueAznaa9ZkLYAYZzuMMHitXKA7DT7F4ZiHLCBaeh1wpAqVOU2t1MmC4PImDvh9aWZmrIoQPvdCIS8fi31dPykORPS-Ol2YQL1D9bcj9sRPd3pz8vOt6VVnHIJwyD6AaP1xMksLXW-S_it6W2QFUCwo6-9w_2msH-vjNI111bSRkc75FX9WqcfKxTv1WMetr5Wszxn0kMJg2NahtaXMGJfBebqUPIc0uGoIvAPe-PmgYJCWyUACdkVr5MO4tRPnkTIpVRnxrG3cgCbhWgGrMGsinw6XiH7TKRm=w1280-h853-no",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    },
    {
        name: "Canyon Floor",
        image: "https://lh3.googleusercontent.com/tcX0bBMk-IvteteF6O05719Ip1iNOecjPs_2yxvrRC5OsGlBprJpefplklMHAH1Axbysw8ggpsmQTQPiYqxdMREAjNuE0egJFURwLgWsWlK5fY70XUGisU2sdk-pk7n5nrKiEhbgqxYJUEBNvxXQNAe5b0l5VlZdwmzlHHTgvkMECZtfh6mZmaUMND_BM0wFIW9yLscyQmdEymNGuXGzC9oL_wwMEWc3b6JXes6mkg_gCHj2YjeUA1jsW57mnHFJMOeXuNujzmbz-1EyA4kzGD3UqDZlofTsA8CMq4nK6o-WaKiXLVA7qg2dp6Mtrv1GzdWF9w9VoytZM3-Uhhi_zDEvedKcwbm-gcrpxrhX253H6_4_jsX7Hyf9BjdMCWSPvMOPuCd-C80jC16W19g2eW_SkQlku75tix9igb2evNrw8V76d2MAie-_tJvypsmrZpssQBf9GZoiKwmjerPHac5iG3L2wjKOdc4Cvf_N3B_ALJ4gD5GbIuLMkoocjQ5Ln8hkwqC8ica_I7VE1s72FCWYd_VAfYbCL8NoIIBDfQ1bs7KvaESoODhsXyssRNmJSCQvb5PmRbnLejPePuQHdWi0FCNLOOtHtF4nl0iTTLJQNz_FodWVaYri4Ff_Phg59ihJ8cyg_hycijE8XFhDHiA-yLQSbL_O2ZfvBBJi7FS7xDCe06rXyNnG=w1280-h718-no",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    }]

    function seedDB(){
        //Remove all campgrounds
        Campground.remove({}, function(err){
            //  if(err){
            //      console.log(err);
            //  }
            //  console.log("removed campgrounds!");
            //  Comment.remove({}, function(err) {
            //      if(err){
            //          console.log(err);
            //      }
            //      console.log("removed comments!");
            //       //add a few campgrounds
            //      data.forEach(function(seed){
            //          Campground.create(seed, function(err, campground){
            //              if(err){
            //                  console.log(err)
            //              } else {
            //                  console.log("added a campground");
            //                  //create a comment
            //                  Comment.create(
            //                      {
            //                          text: "This place is great, but I wish there was internet",
            //                          author: "Homer"
            //                      }, function(err, comment){
            //                          if(err){
            //                              console.log(err);
            //                          } else {
            //                              campground.comments.push(comment);
            //                              campground.save();
            //                              console.log("Created new comment");
            //                          }
            //                      });
            //              }
            //          });
            //      });
            //  });
         }); 
         //add a few comments
     }
      
     module.exports = seedDB;