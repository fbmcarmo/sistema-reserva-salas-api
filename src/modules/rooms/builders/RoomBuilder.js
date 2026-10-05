class RoomBuilder {

    constructor() {
        this.room = {};
    }

    setNome(nome) {
        this.room.nome = nome;
        return this;
    }

    setDescricao(descricao) {
        this.room.descricao = descricao;
        return this;
    }

    setCapacidade(capacidade) {
        this.room.capacidade = capacidade;
        return this;
    }

    setLocalizacao(localizacao) {
        this.room.localizacao = localizacao;
        return this;
    }

    setRecursos(recursos) {
        this.room.recursos = recursos;
        return this;
    }

    setStatus(status) {
        this.room.status = status;
        return this;
    }

    build() {
        return {
            ...this.room,
        };
    }
}

module.exports = RoomBuilder;