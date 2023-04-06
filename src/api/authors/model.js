import mongoose from "mongoose";
import bcrypt from "bcrypt"

const { Schema, model } = mongoose

const authorSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, required: true, enum: ["Admin", "User"], default: "User" },
        blogPosts: [{ type: Schema.Types.ObjectId, ref: "BlogPost" }]
    },
    { timestamps: true }
)

authorSchema.pre("save", async function () {
    const newAuthorData = this

    if (newAuthorData.isModified("password")) {
        const plainPW = newAuthorData.password

        const hash = await bcrypt.hash(plainPW, 11)
        newAuthorData.password = hash
    }
})

authorSchema.methods.toJSON = function () {
    const currentAuthorDocument = this
    const currentAuthor = currentAuthorDocument.toObject()
    delete currentAuthor.password
    delete currentAuthor.createdAt
    delete currentAuthor.updatedAt
    delete currentAuthor.__v
    return currentAuthor
}

authorSchema.static("checkCredentials", async function (email, plainPW) {
    const author = await this.findOne({ email })

    if (author) {
        const passwordMatch = await bcrypt.compare(plainPW, author.password)

        if (passwordMatch) {
            return author
        } else {
            return null
        }
    } else {
        return null
    }
})

export default model("Author", authorSchema)