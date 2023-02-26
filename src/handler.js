const {nanoid} = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
    const {title, tags, body} = request.payload;
    const  id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: "success",
            message: "Successfully added note",
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Failed to add note",
    });

    response.code(500);
    return response;
};

const getAllNotesHandler = () => ({
    status: "success",
    data: {
        notes,
    },
});

const getNoteByHandler = (request, h) => {
    const {id} = request.params;
    const note = notes.filter(n => n.id === id)[0];

    let response;

    if (note !== undefined) {
        response = h.response({
            status: "success",
            data: {
                note,
            },
        });
        response.code(200);
    } else {
        response = h.response({
            status: "fail",
            message: "Note not found",
        });
        response.code(404);
    }

    return response;
};

const editNoteByIdHandler = (request, h) => {
    const {id} = request.params;
    const {title, tags, body} = request.payload;
    const updateAt = new Date().toISOString();

    const index = notes.findIndex(note => note.id === id);

    let response;

    if (index === -1) {
        response = h.response({
            status: "fail",
            message: "Note not found. Failed to update note",
        });
        response.code(404);
    } else {
        notes[index] = {...notes[index], title, tags, body, updateAt};
        response = h.response({
            status: "success",
            message: "Successfully update note",
        });
        response.code(200);
    }

    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    const {id} = request.params;
    const index = notes.findIndex(note => note.id === id);
    let response;

    if (index === -1) {
        response = h.response({
            status: "fail",
            message: "Note not found. Not failed to delete.",
        });
        response.code(404);
    } else {
        notes.splice(index, 1);
        response = h.response({
            status: "success",
            message: "Successfullly deleted note.",
        });
        response.code(200);
    }

    return response;
};

module.exports = {
    addNoteHandler,
    getAllNotesHandler,
    getNoteByHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler,
};
