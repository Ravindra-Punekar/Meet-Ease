const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');

class AuthController {
    async sendOtp(req, res){

        const { phone } = req.body;
        
        if(!phone){
            res.status(400).json({message: 'Phone field is required'});
        }

        //generate otp
        const otp = await otpService.generateOtp();

        //hash
        const ttl = 1000*60*2; //time-to-leave - 2min
        const expires = Date.now()+ttl;
        const data = `${phone}.${otp}.${expires}`   //hash
        // const hash = hashService.hashOtp(data);
        //till 2:37:00 
        res.json({otp: otp});
    }
}

module.exports = new AuthController();