class UsersHandler {
  constructor(service) {
    this.service = service;
  }

  async postUserHandler(request, h) {
    const userId = await this.service.addUser(request.payload);
    return h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    }).code(201);
  }

  async getUserByIdHandler(request) {
    const { id } = request.params;
    const user = await this.service.getUserById(id);
    return {
      status: 'success',
      data: {
        user,
      },
    };
  }
}

module.exports = UsersHandler;
