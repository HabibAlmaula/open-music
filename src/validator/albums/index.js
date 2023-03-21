const {AlbumPayloadSchema} = require("./schema");
const InVariantError = require("../../exception/InVariantError");
const AlbumsValidator =  {
    validateAlbumPayload: (payload)=> {
        const validationResult = AlbumPayloadSchema.validate(payload);
        if (validationResult.error){
            throw new InVariantError(validationResult.error.message);
        }
    }

}

module.exports = AlbumsValidator;
