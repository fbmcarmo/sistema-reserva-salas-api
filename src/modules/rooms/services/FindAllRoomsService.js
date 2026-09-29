class FindAllRoomsService {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async execute() {
    return await this.roomRepository.findAll();
  }
}

module.exports = FindAllRoomsService;