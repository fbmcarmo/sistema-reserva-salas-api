class UserRepositoryBridge {
    constructor(repositoryImplementation) {
        this.repositoryImplementation =
            repositoryImplementation;
    }

    async create(userData) {
        return this.repositoryImplementation.create(
            userData
        );
    }

    async findAll() {
        return this.repositoryImplementation.findAll();
    }

    async findById(id) {
        return this.repositoryImplementation.findById(
            id
        );
    }

    async findByEmail(email) {
        return this.repositoryImplementation.findByEmail(
            email
        );
    }

    async update(id, userData) {
        return this.repositoryImplementation.update(
            id,
            userData
        );
    }

    async delete(id) {
        return this.repositoryImplementation.delete(
            id
        );
    }
}

module.exports = UserRepositoryBridge;