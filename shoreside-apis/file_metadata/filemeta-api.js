/* A web API that allows a user to submit a FormData file upload parameter with the request.
  When the file is submitted, file metadata will be returned as JSON. Hooks into an Express app.*/

  router.post("/apis/filemeta", upload.single("file"), function(request, response, next) {
    let responseObj = { "file_name" : request.file.originalname, "file_size_bytes" : request.file.size };

    response.setHeader("Content-Type", "application/json");
    response.json(responseObj);
  });
