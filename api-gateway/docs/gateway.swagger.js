/**
 * @swagger
 * tags:
 *   name: Gateway
 *   description: API Gateway proxy endpoints
 */

/**
 * @swagger
 * /api/{service}/{path}:
 *   all:
 *     summary: Proxy any request to the appropriate microservice
 *     tags: [Gateway]
 *     parameters:
 *       - in: path
 *         name: service
 *         schema:
 *           type: string
 *         required: true
 *         description: Service name (e.g., auth, users, notifications)
 *       - in: path
 *         name: path
 *         schema:
 *           type: string
 *         required: true
 *         description: Path to proxy to the service
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Proxied response from the microservice
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
