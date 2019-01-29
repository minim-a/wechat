'use strict';

// 来访预约的key
const visitorAppointmentKey="11";
// 邀约的key
const visitorInviteKey="12";

module.exports ={
    "button": [
        {
            "name": "预约",
            "sub_button": [
                {
                    "type": "view",
                    "name": "来访人",
                    "url": "http://minima.mynatapp.cc/wechat/redirect?subjoin=1"
                },
                {
                    "type": "view",
                    "name": "邀约",
                    "url": "http://minima.mynatapp.cc/wechat/redirect?subjoin=2"
                }
            ]
        }
    ]
};