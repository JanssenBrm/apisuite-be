const Joi = require('joi')
const validator = require('./validator')

const apiDocsItemsSchema = Joi.object({
  title: Joi.string().optional(),
  info: Joi.string().optional(),
  image: Joi.string().optional(),
})

const apiDocsSchema = Joi.object({
  productIntro: Joi.string().optional(),
  features: Joi.array().items(apiDocsItemsSchema),
  useCases: Joi.array().items(apiDocsItemsSchema),
  highlights: Joi.array().items(apiDocsItemsSchema),
})

const apiVersionPatchSchema = Joi.object({
  id: Joi.number().required(),
  live: Joi.boolean().required(),
  deprecated: Joi.boolean().required(),
  deleted: Joi.boolean().required(),
})

const APISchema = Joi.object({
  name: Joi.string().required(),
  baseUri: Joi.string().optional(),
  baseUriSandbox: Joi.string().optional(),
  docs: Joi.array().items(apiDocsSchema).optional(),
  versions: Joi.array().items(apiVersionPatchSchema).optional(),
})

const APIversionSchema = Joi.object({
  live: Joi.boolean().required(),
})

const apiPaginationSchema = Joi.object({
  search: Joi.string().optional(),
  name: Joi.alternatives().try(
    Joi.string(),
    Joi.array().min(1).items(Joi.string()),
  ).optional(),
  type: Joi.alternatives().try(
    Joi.string().valid('local', 'cloud'),
    Joi.array().min(1).items(Joi.string().valid('local', 'cloud')),
  ).optional(),
  page: Joi.number().min(1).optional(),
  pageSize: Joi.number().min(1).optional(),
  sort_by: Joi.string().valid('created', 'updated', 'published').optional(),
  order: Joi.string().valid('asc', 'desc').optional(),
})

module.exports = {
  validateAPIBody: validator(APISchema),
  validateAPIversionBody: validator(APIversionSchema, 'formdata.fields'),
  validateApiVersionPatchBody: validator(apiVersionPatchSchema),
  validateAPIPagination: validator(apiPaginationSchema, 'query'),
}
