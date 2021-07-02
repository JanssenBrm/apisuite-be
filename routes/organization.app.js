const { decorateRouter } = require('@awaitjs/express')
const router = decorateRouter(require('express').Router({ mergeParams: true }))
const { actions, possessions, resources } = require('../util/enums')
const { accessControl, loggedIn } = require('../middleware')
const controllers = require('../controllers')
const { validateAppPatchBody } = require('./validation_schemas/app.schema')

/**
 * @openapi
 * /organizations/{id}/apps:
 *   get:
 *     summary: Get organization apps
 *     description: Returns the list of all organization's apps.
 *     tags: [App]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         description: The organization id
 *         required: true
 *         in: path
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Simplified app list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppList'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.getAsync('/',
  loggedIn,
  accessControl(actions.READ, possessions.OWN, resources.ORGANIZATION, { idCarrier: 'params', idField: 'id', adminOverride: true }),
  controllers.app.listApps)

/**
 * @openapi
 * /organizations/{id}/apps/{appId}:
 *   get:
 *     description: Get application
 *     tags: [App]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         description: The organization id
 *         required: true
 *         in: path
 *         schema:
 *           type: string
 *       - name: appId
 *         description: The application id
 *         required: true
 *         in: path
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: App details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AppV2'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.getAsync('/:appId',
  loggedIn,
  accessControl(actions.UPDATE, possessions.OWN, resources.ORGANIZATION, { idCarrier: 'params', idField: 'id', adminOverride: true }),
  accessControl(actions.READ, possessions.OWN, resources.APP, { idCarrier: 'params', idField: 'appId', adminOverride: true }),
  controllers.app.getApp)

/**
 * @openapi
 * /organizations/{id}/apps/{appId}:
 *   patch:
 *     description: Partial update app fields
 *     tags: [App]
 *     parameters:
 *       - name: id
 *         description: The organization id
 *         required: true
 *         in: path
 *         schema:
 *           type: string
 *       - name: appId
 *         description: The application id
 *         required: true
 *         in: path
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       description: App fields to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AppPatch"
 *     responses:
 *       200:
 *         description: App details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AppV2'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/NotFound'
 */
router.patchAsync('/:appId',
  loggedIn,
  validateAppPatchBody,
  accessControl(actions.UPDATE, possessions.OWN, resources.ORGANIZATION, { idCarrier: 'params', idField: 'id', adminOverride: true }),
  accessControl(actions.UPDATE, possessions.OWN, resources.APP, { idCarrier: 'params', idField: 'appId', adminOverride: true }),
  controllers.app.patchApp)

module.exports = router