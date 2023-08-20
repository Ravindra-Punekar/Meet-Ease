const roomService = require("../services/room-service.js");
const RoomDto =  require("../dtos/room-dto.js");

class RoomsController{
    async create(req, res){
        //room 
        const {topic,roomType} = req.body;
        if(!topic || !roomType){
            return res.status(400).json({message:"All fields are required!"});
        }

        //create room
        const room = await roomService.create({
            topic,
            roomType,
            ownerId: req.user._id,
        });

        return res.json(new RoomDto(room));
    }

    async index(req, res){
        const rooms = await roomService.getAllRooms(['open']); //get all rooms of type open
        const allRooms = rooms.map((room) => new RoomDto(room)); //for each room we are creating a new roomDto
        //for future use of pagination 

        return res.json(allRooms); //return all rooms
    }

} 

module.exports = new RoomsController();