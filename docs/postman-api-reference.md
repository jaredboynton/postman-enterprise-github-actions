Here is a consolidated list of the Collection, Workspace, Fork, and User GET endpoints, along with their descriptions and example response bodies.

**Important Note on GET Request Bodies:** GET requests typically do not include a request body. The "Example Request" details below focus on the parameters (path variables and query parameters) that would be used in the URL to make the request successfully.

---

### Collection Endpoints (GET)

These endpoints relate to managing and retrieving information about Postman Collections.

1.  **Get Collection Access Keys**
    *   **Method & Path:** `GET /collection-access-keys`
    *   **Description:** Gets the authenticated user's personal and team collection access keys. Access keys are valid for 60 days.
    *   **Example Request:** `GET https://api.getpostman.com/collection-access-keys?collectionId=<collectionId>&cursor=<cursor>`
    *   **Example Response Body:**
        ```json
        {
          "data": [
            {
              "id": "Njg5OjU3MDQ1NjYtYmQxZDU3NzktMWVkNS00ZDhjLWI0ZmQtZWRhOGY2Mzg1NTY0",
              "token": "PMAT-**********************43BR",
              "status": "ACTIVE",
              "teamId": 123,
              "userId": 12345678,
              "collectionId": "12345678-12ece9e1-2abf-4edc-8e34-de66e74114d2",
              "expiresAfter": "2024-06-11T13:21:11.000Z",
              "lastUsedAt": "",
              "createdAt": "2024-04-12T13:21:11.000Z",
              "updatedAt": "2024-04-09T11:00:53.000Z"
            },
            {
              "id": "K7yJPzQ18BC7Snm09PXL12RMmnq57hQorFJW8JnCKhQ11JmNQiTlgXnQ1p93jGYN",
              "token": "PMAT-**********************51FZ",
              "status": "ACTIVE",
              "teamId": 123,
              "userId": 56781234,
              "collectionId": "56781234-68e5e7ac-c134-45f4-9770-40e72f3fc474",
              "expiresAfter": "2024-06-11T13:21:11.000Z",
              "lastUsedAt": "2024-04-29T08:24:23.000Z",
              "createdAt": "2024-04-22T10:11:00.000Z",
              "updatedAt": "2024-04-22T10:11:00.000Z"
            }
          ],
          "meta": {
            "nextCursor": "b2Zmc2V0PTEwJmxpbWl0PTEw",
            "prevCursor": ""
          }
        }
        ```

2.  **Get Merge or Pull Task Status**
    *   **Method & Path:** `GET /collection-merges-tasks/:taskId`
    *   **Description:** Gets the status of a collection's merge or a pull changes task.
    *   **Example Request:** `GET https://api.getpostman.com/collection-merges-tasks/:taskId`
    *   **Example Response Body:**
        ```json
        {
          "id": "pm~vc:merge-workflow~12345678-5a027c05-056b-49f5-ac9d-37c29f2d91c3",
          "status": "successful"
        }
        ```

3.  **Get All Forked Collections**
    *   **Method & Path:** `GET /collections/collection-forks`
    *   **Description:** Gets a list of all the authenticated user's forked collections.
    *   **Example Request:** `GET https://api.getpostman.com/collections/collection-forks?cursor=<cursor>&limit=10&direction=asc`
    *   **Example Response Body:**
        ```json
        {
          "data": [
            {
              "forkName": "Collection Fork",
              "forkId": "12345678-667df1ad-2ee3-7890-b678-7742d82e2e1f",
              "sourceId": "87654321-bd46b634-b347-44d4-aa23-8c71ff4ecc4d",
              "createdAt": "2023-11-16T09:18:17.000Z"
            },
            {
              "forkName": "Test Fork",
              "forkId": "12345678-38j9f1ad-2ee3-7890-dv5h-7742d82e2e1f",
              "sourceId": "87654321-bd46b634-b347-44d4-aa23-8c71ff4ecc4d",
              "createdAt": "2023-11-16T09:16:15.000Z"
            }
          ],
          "meta": {
            "total": 2,
            "nextCursor": null,
            "inaccessibleFork": 0
          }
        }
        ```

4.  **Get a Collection's Comments**
    *   **Method & Path:** `GET /collections/:collectionId/comments`
    *   **Description:** Gets all comments left by users in a collection.
    *   **Example Request:** `GET https://api.getpostman.com/collections/:collectionId/comments`
    *   **Example Response Body:**
        ```json
        {
          "data": [
            {
              "id": 46818,
              "threadId": 12345,
              "createdBy": 12345678,
              "createdAt": "2024-01-18T12:00:54.000Z",
              "updatedAt": "2024-01-18T12:00:54.000Z",
              "body": "This is also an example."
            },
            {
              "id": 46817,
              "threadId": 67890,
              "createdBy": 87654321,
              "createdAt": "2024-01-18T11:48:01.000Z",
              "updatedAt": "2024-01-18T11:48:01.000Z",
              "body": "Another example."
            },
            {
              "id": 46814,
              "threadId": 23456,
              "createdBy": 12345678,
              "createdAt": "2024-01-18T11:30:40.000Z",
              "updatedAt": "2024-01-18T11:30:40.000Z",
              "body": "This is an example."
            }
          ]
        }
        ```

5.  **Get a Folder's Comments**
    *   **Method & Path:** `GET /collections/:collectionId/folders/:folderId/comments`
    *   **Description:** Gets all comments left by users in a folder.
    *   **Example Request:** `GET https://api.getpostman.com/collections/:collectionId/folders/:folderId/comments`
    *   **Example Response Body:**
        ```json
        {
          "data": [
            {
              "id": 46818,
              "threadId": 12345,
              "createdBy": 12345678,
              "createdAt": "2024-01-18T12:00:54.000Z",
              "updatedAt": "2024-01-18T12:00:54.000Z",
              "body": "This is also an example."
            },
            {
              "id": 46817,
              "threadId": 67890,
              "createdBy": 87654321,
              "createdAt": "2024-01-18T11:48:01.000Z",
              "updatedAt": "2024-01-18T11:48:01.000Z",
              "body": "Another example."
            },
            {
              "id": 46814,
              "threadId": 23456,
              "createdBy": 12345678,
              "createdAt": "2024-01-18T11:30:40.000Z",
              "updatedAt": "2024-01-18T11:30:40.000Z",
              "body": "This is an example."
            }
          ]
        }
        ```

6.  **Get a Folder**
    *   **Method & Path:** `GET /collections/:collectionId/folders/:folderId`
    *   **Description:** Gets information about a folder in a collection.
    *   **Example Request:** `GET https://api.getpostman.com/collections/:collectionId/folders/:folderId?ids=true&uid=true&populate=true`
    *   **Example Response Body:**
        ```json
        {
          "model_id": "65a99e60-8e0a-4b6e-b79c-7d8264cc5caa",
          "meta": {
            "model": "folder",
            "populate": false,
            "changeset": false,
            "action": "find"
          },
          "data": {
            "owner": "12345678",
            "collection": "12ece9e1-2abf-4edc-8e34-de66e74114d2",
            "folder": null,
            "id": "65a99e60-8e0a-4b6e-b79c-7d8264cc5caa",
            "name": "Test Folder",
            "description": "This is a test collection folder.",
            "variables": null,
            "auth": {
              "type": "apikey",
              "apikey": [
                {
                  "key": "value",
                  "value": "{{apiKey}}"
                },
                {
                  "key": "key",
                  "value": "X-Api-Key"
                },
                {
                  "key": "in",
                  "value": "header"
                }
              ]
            },
            "events": null,
            "order": [
              "81b49e05-0b87-4ca4-ac8c-091aaedafea3",
              "929acf24-4234-45e1-59cf-dc2b27ea7603",
              "3cfc2ac8-00a9-47d2-415d-049773f23268"
            ],
            "folders_order": [
              "65a99e60-8e0a-4b6e-b79c-7d8264cc5caa",
              "5c341de9-5751-461f-b7bd-af86bbae740c"
            ],
            "createdAt": "2022-08-29T16:49:19.964Z",
            "updatedAt": "2022-08-29T16:49:19.964Z"
          }
        }
        ```

7.  **Get a Request's Comments**
    *   **Method & Path:** `GET /collections/:collectionId/requests/:requestId/comments`
    *   **Description:** Gets all comments left by users in a request.
    *   **Example Request:** `GET https://api.getpostman.com/collections/:collectionId/requests/:requestId/comments`
    *   **Example Response Body:**
        ```json
        {
          "data": [
            {
              "id": 46818,
              "threadId": 12345,
              "createdBy": 12345678,
              "createdAt": "2024-01-18T12:00:54.000Z",
              "updatedAt": "2024-01-18T12:00:54.000Z",
              "body": "This is also an example."
            },
            {
              "id": 46817,
              "threadId": 67890,
              "createdBy": 87654321,
              "createdAt": "2024-01-18T11:48:01.000Z",
              "updatedAt": "2024-01-18T11:48:01.000Z",
              "body": "Another example."
            },
            {
              "id": 46814,
              "threadId": 23456,
              "createdBy": 12345678,
              "createdAt": "2024-01-18T11:30:40.000Z",
              "updatedAt": "2024-01-18T11:30:40.000Z",
              "body": "This is an example."
            }
          ]
        }
        ```

8.  **Get a Request**
    *   **Method & Path:** `GET /collections/:collectionId/requests/:requestId`
    *   **Description:** Gets information about a request in a collection.
    *   **Example Request:** `GET https://api.getpostman.com/collections/:collectionId/requests/:requestId?ids=true&uid=true&populate=true`
    *   **Example Response Body:**
        ```json
        {
          "model_id": "c82dd02c-4870-4907-8fcb-593a876cf05b",
          "meta": {
            "model": "request",
            "populate": false,
            "changeset": false,
            "action": "find"
          },
          "data": {
            "owner": "12345678",
            "lastUpdatedBy": "12345678",
            "lastRevision": 32206434799,
            "folder": null,
            "collection": "12ece9e1-2abf-4edc-8e34-de66e74114d2",
            "id": "c82dd02c-4870-4907-8fcb-593a876cf05b",
            "name": "Example GET Request",
            "dataMode": null,
            "data": null,
            "auth": null,
            "events": null,
            "rawModeData": null,
            "descriptionFormat": null,
            "description": "This is an example GET request.",
            "variables": null,
            "headers": null,
            "method": "GET",
            "pathVariables": {},
            "url": "https://postman-echo.com/get",
            "preRequestScript": null,
            "tests": "var data = JSON.parse(responseBody);",
            "currentHelper": null,
            "helperAttributes": null,
            "queryParams": [
              {
                "key": "id",
                "value": "{{id}}",
                "equals": true,
                "description": "Optional. The user's ID.",
                "enabled": true
              }
            ],
            "headerData": [],
            "pathVariableData": [],
            "protocolProfileBehavior": {
              "disableBodyPruning": true
            },
            "dataDisabled": false,
            "responses_order": [],
            "createdAt": "2023-08-22T12:52:01.000Z",
            "updatedAt": "2023-08-22T12:52:11.000Z"
          }
        }
        ```

9.  **Get a Response's Comments**
    *   **Method & Path:** `GET /collections/:collectionId/responses/:responseId/comments`
    *   **Description:** Gets all comments left by users in a response.
    *   **Example Request:** `GET https://api.getpostman.com/collections/:collectionId/responses/:responseId/comments`
    *   **Example Response Body:**
        ```json
        {
          "data": [
            {
              "id": 46818,
              "threadId": 12345,
              "createdBy": 12345678,
              "createdAt": "2024-01-18T12:00:54.000Z",
              "updatedAt": "2024-01-18T12:00:54.000Z",
              "body": "This is also an example."
            },
            {
              "id": 46817,
              "threadId": 67890,
              "createdBy": 87654321,
              "createdAt": "2024-01-18T11:48:01.000Z",
              "updatedAt": "2024-01-18T11:48:01.000Z",
              "body": "Another example."
            },
            {
              "id": 46814,
              "threadId": 23456,
              "createdBy": 12345678,
              "createdAt": "2024-01-18T11:30:40.000Z",
              "updatedAt": "2024-01-18T11:30:40.000Z",
              "body": "This is an example."
            }
          ]
        }
        ```

10. **Get a Response**
    *   **Method & Path:** `GET /collections/:collectionId/responses/:responseId`
    *   **Description:** Gets information about a response in a collection.
    *   **Example Request:** `GET https://api.getpostman.com/collections/:collectionId/responses/:responseId?ids=true&uid=true&populate=true`
    *   **Example Response Body:**
        ```json
        {
          "model_id": "cc364734-7dfd-4bfc-897d-be763dcdbb07",
          "meta": {
            "model": "response",
            "populate": false,
            "changeset": false,
            "action": "find"
          },
          "data": {
            "owner": "12345678",
            "lastUpdatedBy": "12345678",
            "lastRevision": 32457792182,
            "request": "c82dd02c-4870-4907-8fcb-593a876cf05b",
            "id": "cc364734-7dfd-4bfc-897d-be763dcdbb07",
            "name": "Successful GET Response",
            "status": null,
            "responseCode": {
              "code": 200,
              "name": "OK"
            },
            "time": null,
            "headers": [
              {
                "key": "Content-Type",
                "name": "Content-Type",
                "value": "application/json",
                "description": "",
                "type": "text"
              }
            ],
            "cookies": null,
            "mime": null,
            "text": "{\n    \"title\": \"Not Found\",\n    \"detail\": \"Requested API does not exist\",\n    \"type\": \"about:blank\"\n}",
            "language": "json",
            "rawDataType": null,
            "requestObject": "{\"data\":null,\"dataMode\":\"raw\",\"dataOptions\":{\"raw\":{\"language\":\"json\"}},\"headerData\":[{\"key\":\"Accept\",\"value\":\"application/vnd.example.v1+json\",\"description\":\"\",\"type\":\"text\",\"enabled\":true}],\"method\":\"GET\",\"pathVariableData\":[],\"queryParams\":[{\"key\":\"id\",\"value\":\"test-api\",\"equals\":true,\"description\":null,\"enabled\":true}],\"url\":\"http://api.getpostman.com/v1/request?id=test-api\",\"headers\":\"Accept: application/vnd.example.v1+json\\n\",\"pathVariables\":{},\"protocolProfileBehavior\":{\"disableBodyPruning\":true},\"rawModeData\":\"\",\"graphqlModeData\":{}}",
            "createdAt": "2023-09-07T14:39:52.000Z",
            "updatedAt": "2023-09-07T14:41:08.000Z"
          }
        }
        ```

11. **Get a Collection's Roles**
    *   **Method & Path:** `GET /collections/:collectionId/roles`
    *   **Description:** Gets information about all roles in a collection.
    *   **Example Request:** `GET https://api.getpostman.com/collections/:collectionId/roles`
    *   **Example Response Body:**
        ```json
        {
          "group": [
            {
              "role": "VIEWER",
              "id": 123
            }
          ],
          "team": [
            {
              "role": "EDITOR",
              "id": 1
            }
          ],
          "user": [
            {
              "role": "VIEWER",
              "id": 12345678
            },
            {
              "role": "EDITOR",
              "id": 87654321
            }
          ]
        }
        ```

12. **Get Source Collection's Status**
    *   **Method & Path:** `GET /collections/:collectionId/source-status`
    *   **Description:** Checks whether there is a change between the forked collection and its parent (source) collection.
    *   **Example Request:** `GET https://api.getpostman.com/collections/:collectionId/source-status`
    *   **Example Response Body:**
        ```json
        {
          "collection": {
            "12345678-12ece9e1-2abf-4edc-8e34-de66e74114d2": {
              "isSourceAhead": false
            }
          }
        }
        ```

13. **Get a Collection's Tags**
    *   **Method & Path:** `GET /collections/:collectionId/tags`
    *   **Description:** Gets all the tags associated with a collection.
    *   **Example Request:** `GET https://api.getpostman.com/collections/:collectionId/tags`
    *   **Example Response Body:**
        ```json
        {
          "tags": [
            {
              "slug": "needs-review"
            },
            {
              "slug": "test-api"
            }
          ]
        }
        ```

14. **Transform Collection to OpenAPI**
    *   **Method & Path:** `GET /collections/:collectionId/transformations`
    *   **Description:** Transforms an existing Postman Collection into a stringified OpenAPI definition.
    *   **Example Request:** `GET https://api.getpostman.com/collections/:collectionId/transformations?format=json`
    *   **Example Response Body:**
        ```json
        {
          "output": "{\n  \"openapi\": \"3.0.3\",\n  \"info\": {\n    \"title\": \"Sample API\",\n    \"description\": \"Buy or rent spacecrafts\\n\\nContact Support:\\n Name: Jon\",\n    \"version\": \"1.0.0\",\n    \"contact\": {}\n  },\n  \"servers\": [\n    {\n      \"url\": \"example.com\"\n    }\n  ],\n  \"paths\": {\n    \"/spacecrafts/{spacecraftId}\": {\n      \"get\": {\n        \"tags\": [\n          \"spacecrafts\",\n          \"{spacecraftId}\"\n        ],\n        \"summary\": \"Read a spacecraft\",\n        \"description\": \"Read a spacecraft\",\n        \"operationId\": \"readASpacecraft\",\n        \"responses\": {\n          \"200\": {\n            \"description\": \"The spacecraft corresponding to the provided `spacecraftId`\",\n            \"content\": {\n              \"application/json\": {\n                \"schema\": {\n                  \"type\": \"object\",\n                  \"properties\": {\n                    \"description\": {\n                      \"type\": \"string\",\n                      \"example\": \"<string>\"\n                    },\n                    \"id\": {\n                      \"type\": \"string\",\n                      \"example\": \"<string>\"\n                    },\n                    \"name\": {\n                      \"type\": \"string\",\n                      \"example\": \"<string>\"\n                    },\n                    \"type\": {\n                      \"type\": \"string\",\n                      \"example\": \"satellite\"\n                    }\n                  }\n                },\n                \"examples\": {\n                  \"The spacecraft corresponding to the provided `spacecraftId`\": {\n                    \"value\": {\n                      \"description\": \"<string>\",\n                      \"id\": \"<string>\",\n                      \"name\": \"<string>\",\n                      \"type\": \"satellite\"\n                    }\n                  }\n                }\n              }\n            }\n          },\n          \"404\": {\n            \"description\": \"No spacecraft found for the provided `spacecraftId`\",\n            \"content\": {\n              \"application/json\": {\n                \"schema\": {\n                  \"type\": \"object\",\n                  \"properties\": {\n                    \"message\": {\n                      \"type\": \"string\",\n                      \"example\": \"<string>\"\n                    }\n                  }\n                },\n                \"examples\": {\n                  \"No spacecraft found for the provided `spacecraftId`\": {\n                    \"value\": {\n                      \"message\": \"<string>\"\n                    }\n                  }\n                }\n              }\n            }\n          },\n          \"500\": {\n            \"description\": \"Unexpected error\",\n            \"content\": {\n              \"application/json\": {\n                \"schema\": {\n                  \"type\": \"object\",\n                  \"properties\": {\n                    \"message\": {\n                      \"type\": \"string\",\n                      \"example\": \"<string>\"\n                    }\n                  }\n                },\n                \"examples\": {\n                  \"Unexpected error\": {\n                    \"value\": {\n                      \"message\": \"<string>\"\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      },\n      \"parameters\": [\n        {\n          \"name\": \"spacecraftId\",\n          \"in\": \"path\",\n          \"required\": true,\n          \"schema\": {\n            \"type\": \"string\",\n            \"example\": \"<string>\"\n          },\n          \"description\": \"(Required) The unique identifier of the spacecraft\"\n        }\n      ]\n    }\n  },\n  \"components\": {\n    \"securitySchemes\": {\n      \"apiKey\": {\n        \"type\": \"apiKey\",\n        \"name\": \"X-Api-Key\",\n        \"in\": \"header\"\n      }\n    }\n  },\n  \"security\": [\n    {\n      \"apiKey\": []\n    }\n  ],\n  \"tags\": [\n    {\n      \"name\": \"spacecrafts\"\n    },\n    {\n      \"name\": \"{spacecraftId}\"\n    }\n  ]\n}"
        }
        ```

15. **Get a Collection**
    *   **Method & Path:** `GET /collections/:collectionId`
    *   **Description:** Gets information about a collection.
    *   **Example Request:** `GET https://api.getpostman.com/collections/:collectionId?access_key=<access_key>&model=minimal`
    *   **Example Response Body:**
        ```json
        {
          "collection": {
            "info": {
              "_postman_id": "12ece9e1-2abf-4edc-8e34-de66e74114d2",
              "name": "Test Collection",
              "description": "This is a sample collection that makes a tiny request to Postman Echo service to get the list of request headers sent by a HTTP client.",
              "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
              "updatedAt": "2023-10-13T08:14:22.000Z",
              "uid": "12345678-12ece9e1-2abf-4edc-8e34-de66e74114d2",
              "createdAt": "2023-10-08T13:04:28.000Z",
              "lastUpdatedBy": "12345678"
            },
            "item": [
              {
                "name": "Example GET Request",
                "id": "6d64ff6f-8a48-4442-8109-25b7b4c8dcbf",
                "protocolProfileBehavior": {
                  "disableBodyPruning": true
                },
                "request": {
                  "method": "GET",
                  "header": [],
                  "url": {
                    "raw": "https://postman-echo.com/get",
                    "protocol": "https",
                    "host": [
                      "postman-echo",
                      "com"
                    ],
                    "path": [
                      "get"
                    ]
                  }
                },
                "response": [],
                "uid": "12345678-6d64ff6f-8a48-4442-8109-25b7b4c8dcbf"
              }
            ],
            "auth": {
              "type": "apikey",
              "apikey": [
                {
                  "key": "value",
                  "value": "abc123",
                  "type": "string"
                },
                {
                  "key": "key",
                  "value": "x-api-key",
                  "type": "string"
                }
              ]
            },
            "event": [
              {
                "listen": "prerequest",
                "script": {
                  "id": "cc22c328-3dcc-46c1-a357-7e2f72f54cf6",
                  "type": "text/javascript",
                  "packages": {},
                  "exec": [
                    "try {",
                    "    const response = await pm.sendRequest({",
                    "        url: \"https://postman-echo.com/get\",",
                    "        method: \"GET\"",
                    "    });",
                    "",
                    "    console.log(response.json());",
                    "} catch (err) {",
                    "    console.error(err);",
                    "}"
                  ]
                }
              },
              {
                "listen": "test",
                "script": {
                  "id": "5db243ea-5022-4d08-a620-b8fb9d561af5",
                  "type": "text/javascript",
                  "packages": {},
                  "exec": [
                    "pm.test(\"Status code is 200\", function () {",
                    "    pm.response.to.have.status(200);",
                    "});"
                  ]
                }
              }
            ],
            "variable": [
              {
                "key": "userId",
                "value": "ABC123",
                "type": "string"
              }
            ]
          }
        }
        ```

16. **Get a Spec's Generated Collections**
    *   **Method & Path:** `GET /specs/:specId/generations/:elementType`
    *   **Description:** Gets all of an API specification's generated collections.
    *   **Example Request:** `GET https://api.getpostman.com/specs/:specId/generations/:elementType?limit=10&cursor=<cursor>`
    *   **Example Response Body:**
        ```json
        {
          "meta": {
            "nextCursor": null
          },
          "collections": [
            {
              "id": "e8a015e0-f472-4bb3-a523-57ce7c4583ed",
              "name": "Sample API",
              "state": "in-sync",
              "createdAt": "2025-03-17T11:03:15Z",
              "updatedAt": "2025-03-17T11:03:15Z",
              "createdBy": 12345678,
              "updatedBy": 12345678
            },
            {
              "id": "876211d4-fff8-439c-bb3f-ffb3c565dd21",
              "name": "Sample API",
              "state": "out-of-sync",
              "createdAt": "2025-03-15T11:37:15Z",
              "updatedAt": "2025-03-15T11:37:15Z",
              "createdBy": 12345678,
              "updatedBy": 12345678
            }
          ]
        }
        ```

17. **Get All Collections**
    *   **Method & Path:** `GET /collections`
    *   **Description:** Gets all of your collections.
    *   **Example Request:** `GET https://api.getpostman.com/collections?workspace=<workspaceId>&name=<name>&limit=3&offset=0`
    *   **Example Response Body:**
        ```json
        {
          "collections": [
            {
              "id": "026fa484-c108-4223-af5e-e97137865143",
              "name": "Test API 3.1.0",
              "owner": "892436",
              "createdAt": "2024-09-09T14:16:40.000Z",
              "updatedAt": "2024-09-09T14:16:40.000Z",
              "uid": "892436-026fa484-c108-4223-af5e-e97137865143",
              "isPublic": false
            },
            {
              "id": "02c5343c-0a8d-4bd9-941c-cd9dadd73770",
              "name": "Sanity tests collection changed all values",
              "owner": "892436",
              "createdAt": "2024-03-01T23:01:22.000Z",
              "updatedAt": "2024-03-01T23:01:32.000Z",
              "uid": "892436-02c5343c-0a8d-4bd9-941c-cd9dadd73770",
              "isPublic": false
            },
            {
              "id": "044f35b0-dffe-4ce6-9114-165c720657de",
              "name": "Sanity tests collection",
              "owner": "892436",
              "createdAt": "2023-08-21T15:06:57.000Z",
              "updatedAt": "2023-08-21T15:06:57.000Z",
              "uid": "892436-044f35b0-dffe-4ce6-9114-165c720657de",
              "isPublic": false
            }
          ]
        }
        ```

---

### Workspace Endpoints (GET)

These endpoints manage and retrieve information about Postman Workspaces.

1.  **Get a Workspace's Activity Feed**
    *   **Method & Path:** `GET /workspaces/:workspaceId/activities`
    *   **Description:** Gets a workspace's activity feed, showing who performed actions on elements within the workspace.
    *   **Example Request:** `GET https://api.getpostman.com/workspaces/:workspaceId/activities?userId=<userId>&elementType=<elementType>&limit=10&cursor=<cursor>`
    *   **Example Response Body:**
        ```json
        {
          "meta": {
            "nextCursor": "bmV4dDppZDpZWEpqYUdsMllXeEVRaXhtWldWa2MxOHlNREkxWHpFc01UTXpNelE0"
          },
          "data": [
            {
              "workspaceId": "1f0df51a-8658-4ee8-a2a1-d2567dfa09a9",
              "createdAt": "2025-04-07T14:33:23Z",
              "updatedAt": "2025-04-07T14:33:23Z",
              "id": 15178,
              "user": {
                "id": 12345678,
                "username": "research-physicist-12345678",
                "isPartner": false,
                "name": "Taylor Lee"
              },
              "action": "update",
              "elementType": "collection",
              "trigger": "update",
              "elementId": "12345678-12ece9e1-2abf-4edc-8e34-de66e74114d2",
              "elementName": "Test API"
            },
            {
              "workspaceId": "1f0df51a-8658-4ee8-a2a1-d2567dfa09a9",
              "createdAt": "2025-04-07T14:33:23Z",
              "updatedAt": "2025-04-07T14:33:23Z",
              "id": 15177,
              "user": {
                "id": 12345678,
                "username": "research-physicist-12345678",
                "isPartner": false,
                "name": "Taylor Lee"
              },
              "action": "update",
              "elementType": "collection",
              "trigger": "update",
              "elementId": "12345678-12ece9e1-2abf-4edc-8e34-de66e74114d2",
              "elementName": "New Collection"
            },
            {
              "workspaceId": "1f0df51a-8658-4ee8-a2a1-d2567dfa09a9",
              "createdAt": "2025-04-07T13:59:02Z",
              "updatedAt": "2025-04-07T13:59:02Z",
              "id": 15131,
              "user": {
                "id": 12345678,
                "username": "research-physicist-12345678",
                "isPartner": false,
                "name": "Taylor Lee"
              },
              "action": "update",
              "elementType": "workspace",
              "trigger": "update_visibility",
              "elementId": "1f0df51a-8658-4ee8-a2a1-d2567dfa09a9",
              "elementName": "Testing APIs"
            }
          ]
        }
        ```

2.  **Get Workspace Global Variables**
    *   **Method & Path:** `GET /workspaces/:workspaceId/global-variables`
    *   **Description:** Gets a workspace's global variables.
    *   **Example Request:** `GET https://api.getpostman.com/workspaces/:workspaceId/global-variables`
    *   **Example Response Body:**
        ```json
        {
          "values": [
            {
              "key": "api-key",
              "type": "secret",
              "value": "PMAK-XXXX",
              "enabled": true
            },
            {
              "key": "collection_uid",
              "type": "default",
              "value": "12345678-12ece9e1-2abf-4edc-8e34-de66e74114d2",
              "enabled": true
            }
          ]
        }
        ```

3.  **Get Workspace Roles**
    *   **Method & Path:** `GET /workspaces/:workspaceId/roles`
    *   **Description:** Gets the roles of users and user groups in a workspace.
    *   **Example Request:** `GET https://api.getpostman.com/workspaces/:workspaceId/roles?include=scim`
    *   **Example Response Body:**
        ```json
        {
          "roles": [
            {
              "id": "3",
              "displayName": "Admin",
              "user": [
                "12345678"
              ],
              "group": [
                "123"
              ]
            }
          ]
        }
        ```

4.  **Get Workspace Tags**
    *   **Method & Path:** `GET /workspaces/:workspaceId/tags`
    *   **Description:** Gets all the tags associated with a workspace.
    *   **Example Request:** `GET https://api.getpostman.com/workspaces/:workspaceId/tags`
    *   **Example Response Body:**
        ```json
        {
          "tags": [
            {
              "slug": "needs-review"
            },
            {
              "slug": "test-api"
            }
          ]
        }
        ```

5.  **Get a Workspace**
    *   **Method & Path:** `GET /workspaces/:workspaceId`
    *   **Description:** Gets information about a workspace.
    *   **Example Request:** `GET https://api.getpostman.com/workspaces/:workspaceId?include=mocks:deactivated`
    *   **Example Response Body:**
        ```json
        {
          "workspace": {
            "id": "1f0df51a-8658-4ee8-a2a1-d2567dfa09a9",
            "name": "Team Workspace",
            "type": "team",
            "description": "This is a team workspace.",
            "visibility": "team",
            "createdBy": "12345678",
            "updatedBy": "12345678",
            "createdAt": "2022-07-06T16:18:32.000Z",
            "updatedAt": "2022-07-06T20:55:13.000Z",
            "about": "Team workspace.",
            "collections": [
              {
                "id": "12ece9e1-2abf-4edc-8e34-de66e74114d2",
                "name": "Test Collection",
                "uid": "12345678-12ece9e1-2abf-4edc-8e34-de66e74114d2"
              }
            ],
            "environments": [
              {
                "id": "5daabc50-8451-43f6-922d-96b403b4f28e",
                "name": "Test Environment",
                "uid": "12345678-5daabc50-8451-43f6-922d-96b403b4f28e"
              }
            ],
            "mocks": [
              {
                "id": "e3d951bf-873f-49ac-a658-b2dcb91d3289",
                "name": "Test Mock",
                "uid": "12345678-e3d951bf-873f-49ac-a658-b2dcb91d3289",
                "deactivated": false
              }
            ],
            "monitors": [
              {
                "id": "1e6b6cc1-c760-48e0-968f-4bfaeeae9af1",
                "name": "Test Monitor",
                "uid": "12345678-1e6b6cc1-c760-48e0-968f-4bfaeeae9af1",
                "deactivated": false
              }
            ],
            "apis": [
              {
                "id": "387c2863-6ee3-4a56-8210-225f774edade",
                "name": "Test API",
                "uid": "12345678-387c2863-6ee3-4a56-8210-225f774edade"
              }
            ]
          }
        }
        ```

6.  **Get All Workspaces**
    *   **Method & Path:** `GET /workspaces`
    *   **Description:** Gets all workspaces, including personal, team, private, public, and partner workspaces.
    *   **Example Request:** `GET https://api.getpostman.com/workspaces?type=<type>&createdBy=<createdBy>&include=mocks:deactivated`
    *   **Example Response Body:**
        ```json
        {
          "workspaces": [
            {
              "id": "1f0df51a-8658-4ee8-a2a1-d2567dfa09a9",
              "name": "My Workspace",
              "type": "personal",
              "visibility": "personal",
              "createdBy": "12345678"
            },
            {
              "id": "a0f46158-1529-11ee-be56-0242ac120002",
              "name": "Private Workspace",
              "type": "team",
              "visibility": "private",
              "createdBy": "12345678"
            },
            {
              "id": "f8801e9e-03a4-4c7b-b31e-5db5cd771696",
              "name": "Team Workspace",
              "type": "team",
              "visibility": "team",
              "createdBy": "12345678"
            },
            {
              "id": "74dbfab8-1529-11ee-be56-0242ac120002",
              "name": "Public Workspace",
              "type": "team",
              "visibility": "public",
              "createdBy": "12345678"
            },
            {
              "id": "74dbfab8-1529-11ee-be56-0242ac120002",
              "name": "Partner Workspace",
              "type": "team",
              "visibility": "partner",
              "createdBy": "12345678"
            }
          ]
        }
        ```

7.  **Get All Roles (Workspace Roles)**
    *   **Method & Path:** `GET /workspaces-roles`
    *   **Description:** Gets information about all available roles within a workspace, detailing permissions for users and user groups.
    *   **Example Request:** `GET https://api.getpostman.com/workspaces-roles`
    *   **Example Response Body:**
        ```json
        {
          "roles": {
            "user": [
              {
                "id": "3",
                "displayName": "Admin",
                "description": "Can manage workspace details and members."
              },
              {
                "id": "1",
                "displayName": "Viewer",
                "description": "Can view, fork, and export workspace resources."
              },
              {
                "id": "2",
                "displayName": "Editor",
                "description": "Can create and edit workspace resources."
              }
            ],
            "usergroup": [
              {
                "id": "3",
                "displayName": "Admin",
                "description": "Can manage workspace details and members."
              },
              {
                "id": "1",
                "displayName": "Viewer",
                "description": "Can view, fork, and export workspace resources."
              },
              {
                "id": "2",
                "displayName": "Editor",
                "description": "Can create and edit workspace resources."
              }
            ]
          }
        }
        ```

---

### Fork Endpoints (GET)

These endpoints relate to managing forks of environments.

1.  **Get an Environment's Forks**
    *   **Method & Path:** `GET /environments/:environmentId/forks`
    *   **Description:** Gets all forked environments associated with a specific environment.
    *   **Example Request:** `GET https://api.getpostman.com/environments/:environmentId/forks?cursor=<cursor>&direction=asc&limit=10&sort=createdAt`
    *   **Example Response Body:**
        ```json
        {
          "data": [
            {
              "forkId": "12345678-2fgh78uj-2ee3-8ugc-b678-7742d82e2e1f",
              "forkName": "my fork",
              "createdAt": "2023-11-16T09:18:17.000Z",
              "createdBy": "Taylor Lee",
              "updatedAt": "2023-11-16T09:18:17.000Z"
            },
            {
              "forkId": "12345678-667df1ad-2ee3-6yhn-b678-7742d82e2e1f",
              "forkName": "fork2",
              "createdAt": "2023-11-16T09:16:15.000Z",
              "createdBy": "Taylor Lee",
              "updatedAt": "2023-11-16T09:16:15.000Z"
            }
          ],
          "meta": {
            "total": 6,
            "nextCursor": null
          }
        }
        ```

---

### User Endpoints (GET)

These endpoints retrieve information about users within Postman.

1.  **SCIM v2 Get a User**
    *   **Method & Path:** `GET /scim/v2/Users/:userId`
    *   **Description:** Gets information about a specific Postman team member using their SCIM ID.
    *   **Example Request:** `GET https://api.getpostman.com/scim/v2/Users/:userId`
    *   **Example Response Body:**
        ```json
        {
          "schemas": [
            "urn:ietf:params:scim:schemas:core:2.0:User"
          ],
          "id": "405775fe15ed41872a8eea4c8aa2b38cda9749812cc55c99",
          "userName": "taylor.lee@example.com",
          "name": {
            "givenName": "Taylor",
            "familyName": "Lee"
          },
          "externalId": "12345678",
          "active": true,
          "meta": {
            "resourceType": "User",
            "created": "2021-02-22T04:24:13.000Z",
            "lastModified": "2021-02-22T04:24:13.000Z"
          }
        }
        ```

2.  **SCIM v2 Get All Users**
    *   **Method & Path:** `GET /scim/v2/Users`
    *   **Description:** Gets information about all Postman team members. This endpoint supports filtering by `userName` or `active` status.
    *   **Example Request:** `GET https://api.getpostman.com/scim/v2/Users?startIndex=1&count=2&filter=userName%20eq%20%22taylor-lee%2540example.com%22`
    *   **Example Response Body:**
        ```json
        {
          "schemas": [
            "urn:ietf:params:scim:api:messages:2.0:ListResponse"
          ],
          "totalResults": 2,
          "startIndex": 1,
          "itemsPerPage": 2,
          "Resources": [
            {
              "schemas": [
                "urn:ietf:params:scim:schemas:core:2.0:User"
              ],
              "id": "405775fe15ed41872a8eea4c8aa2b38cda9749812cc55c99",
              "userName": "taylor.lee@example.com",
              "name": {
                "givenName": "Taylor",
                "familyName": "Lee"
              },
              "externalId": "12345678",
              "active": true,
              "meta": {
                "resourceType": "User",
                "created": "2021-02-22T04:24:13.000Z",
                "lastModified": "2021-02-22T04:24:13.000Z"
              }
            },
            {
              "schemas": [
                "urn:ietf:params:scim:schemas:core:2.0:User"
              ],
              "id": "123775fe15ed41872a8eea4c8aa2b38cda9749812cc55c99",
              "userName": "alex.cruz@example.com",
              "name": {
                "givenName": "Alex",
                "familyName": "Cruz"
              },
              "externalId": "87654321",
              "active": false,
              "meta": {
                "resourceType": "User",
                "created": "2021-02-22T04:24:13.000Z",
                "lastModified": "2021-02-22T04:24:13.000Z"
              }
            }
          ]
        }
        ```

3.  **Get a Team User**
    *   **Method & Path:** `GET /users/:userId`
    *   **Description:** Gets information about a specific user on the Postman team.
    *   **Example Request:** `GET https://api.getpostman.com/users/:userId`
    *   **Example Response Body:**
        ```json
        {
          "id": 1,
          "name": "Taylor Lee",
          "username": "taylor-lee",
          "email": "taylor.lee@example.com",
          "roles": [
            "user",
            "admin"
          ],
          "joinedAt": "2022-11-23T14:38:25.000Z"
        }
        ```

4.  **Get All Team Users**
    *   **Method & Path:** `GET /users`
    *   **Description:** Gets information about all users on the Postman team. This endpoint can be filtered by `groupId`.
    *   **Example Request:** `GET https://api.getpostman.com/users?groupId=<groupId>`
    *   **Example Response Body:**
        ```json
        {
          "data": [
            {
              "id": 1,
              "name": "Taylor Lee",
              "username": "taylor-lee",
              "email": "taylor.lee@example.com",
              "roles": [
                "admin",
                "user"
              ],
              "joinedAt": "2022-11-23T14:38:25.000Z"
            },
            {
              "id": 2,
              "name": "Alex Cruz",
              "username": "alex-cruz",
              "email": "alex.cruz@example.com",
              "roles": [
                "user"
              ],
              "joinedAt": "2022-11-24T10:18:11.000Z"
            }
          ]
        }
        ```

5.  **Get Authenticated User**
    *   **Method & Path:** `GET /me`
    *   **Description:** Gets information about the authenticated user, including their ID, username, email, team details, and usage statistics for various Postman features.
    *   **Example Request:** `GET https://api.getpostman.com/me`
    *   **Example Response Body:**
        ```json
        {
          "user": {
            "id": 12345678,
            "username": "taylor-lee",
            "email": "taylor.lee@example.com",
            "fullName": "Taylor Lee",
            "avatar": "https://res.cloudinary.com/postman/image/upload/t_user_profile_300/v1/user/default-6",
            "isPublic": true,
            "teamId": 123,
            "teamName": "Test Team",
            "teamDomain": "test-team",
            "roles": [
              "user",
              "flow-editor",
              "community-manager"
            ]
          },
          "operations": [
            {
              "name": "api_object_usage",
              "limit": 99999999,
              "usage": 8872,
              "overage": 0
            },
            {
              "name": "collection_run_limit",
              "limit": 99999999,
              "usage": 226,
              "overage": 0
            },
            {
              "name": "file_storage_limit",
              "limit": 1,
              "usage": 0.28,
              "overage": 0
            }
            // ... other operations
          ]
        }
        ```