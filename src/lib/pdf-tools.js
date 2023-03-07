import PdfPrinter from "pdfmake";

export const getPDFReadableStream = blogPost => {
    const fonts = {
        Helvetica: {
            normal: "Helvetica",
            bold: "Helvetica-Bold",
            italics: "Helvetica-Oblique",
            bolditalics: "Helvetica-BoldOblique",
        },
    }
    const printer = new PdfPrinter(fonts)

    const docDefinition = {
        content: ["test test test"],
        // [blogPost.title, blogPost.content],
        defaultStyle: {
            font: "Helvetica",
        }
    }

    const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
    pdfReadableStream.end()

    return pdfReadableStream
}