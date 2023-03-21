const {SongPayloadSchema} = require("./schema");
const InVariantError = require("../../exception/InVariantError");
const SongsValidator =  {
    validateSongPayload: (payload)=> {
        const validationResult = SongPayloadSchema.validate(payload);
        if (validationResult.error){
            throw new InVariantError(validationResult.error.message);
        }
    }

}

module.exports = SongsValidator;
