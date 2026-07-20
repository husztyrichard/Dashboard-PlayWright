# Postman collection examples

The Postman collection and environment for this API live in the repository:

- [postman/Dashboard2.postman_collection.json](../postman/Dashboard2.postman_collection.json)
- [postman/Dashboard2.postman_environment.json](../postman/Dashboard2.postman_environment.json)

These examples assume the environment variable `baseUrl` is set to `http://localhost:3000`.

## Example requests

1. Get all bugs
   - Method: GET
   - URL: `{{baseUrl}}/api/bugs`

2. Get a specific bug
   - Method: GET
   - URL: `{{baseUrl}}/api/bugs/1`

3. Create a bug
   - Method: POST
   - URL: `{{baseUrl}}/api/bugs`
   - Body:
     ```json
     {
       "title": "API login failure",
       "priority": "HIGH"
     }
     ```

4. Update a bug
   - Method: PUT
   - URL: `{{baseUrl}}/api/bugs/1`
   - Body:
     ```json
     {
       "status": "CLOSED"
     }
     ```

5. Delete a bug
   - Method: DELETE
   - URL: `{{baseUrl}}/api/bugs/1`

6. Get API status
   - Method: GET
   - URL: `{{baseUrl}}/api/status`
