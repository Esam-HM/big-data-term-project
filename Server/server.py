from flask import Flask, jsonify, request
from flask_cors import CORS
from hdfs_services import *
from ssh_utils import toggleHDFS, isHadoopRunning, toggleYarn, submitJob

app = Flask(__name__)
CORS(app)

@app.route("/api/jps")
def check_hadoop_status():
    status, res = isHadoopRunning()

    response = {"hdfs" : res[0], "yarn" : res[1]}
    
    if status == -1:
        response["status"] = "error"
        return jsonify(response), 500
    
    response["status"] = "success"
    return jsonify(response), 200


@app.route("/api/hdfs/toggleHDFS", methods=["POST"])
def startStopHDFS():
    try:
        # Read status from JSON body: true => start, false => stop
        data = request.get_json()
        result = toggleHDFS(data.get('status'))

        return jsonify({
            "success": True if 0 in result else False,
            "message": list(result)[1]
        }), 200 if 0 in result else 500

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/hdfs/toggleYarn", methods=["POST"])
def startStopYarn():
    try:
        # Read status from JSON body: true => start, false => stop
        data = request.get_json()
        result = toggleYarn(data.get('status'))

        return jsonify({
            "success": True if 0 in result else False,
            "message": list(result)[1]
        }), 200 if 0 in result else 500

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


## Dir APIs
@app.route("/api/hdfs/getdircontent", methods=["POST"])
def get_dir_content():
    data = request.get_json()
    dir_path = data.get("dir")

    try:
        content = getDirContent(dir_path)

        return jsonify({"content": content}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/hdfs/getDirs", methods=["GET"])
def getDirs():
    allDirs = getAllDirs(["/user"])

    if allDirs == -1:
        return jsonify({"error": "connection error"}), 500
    

    return jsonify({"dirs": allDirs})


@app.route("/api/hdfs/createdir",methods=["POST"])
def create_dir():
    try:
        data = request.get_json()
        newDirPath = data.get("path")

        res = createDirectory(newDirPath)

        return jsonify({"createdPath": newDirPath}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/hdfs/uploadfile', methods=['POST'])
def upload_to_hdfs():
    file = request.files.get('file')
    hdfs_path = request.form.get('targetPath')

    if not file or not hdfs_path:
        return jsonify({'error': 'Missing file or targetPath'}), 400

    try:
        uploaded_path = writeFile(hdfs_path, file.stream)
        return jsonify({'uploadedPath': uploaded_path}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/api/hdfs/readfile",methods=["POST"])
def read_file_with_pagination():
    data = request.get_json()

    filePath = data.get("filePath")
    pageNumber = int(data.get("page"))

    try:
        sl, el = paginate(pageNumber, 300)
        lines = readFile(filePath,sl,el)

        return jsonify({"lines": lines}), 200

    except Exception as e:

        return jsonify({"error": str(e)}), 500

@app.route("/api/hdfs/readrawfile",methods=["POST"])
def read__raw_file_with_pagination():
    data = request.get_json()

    filePath = data.get("filePath")
    pageNumber = int(data.get("page"))

    try:
        sl, el = paginate(pageNumber, 300)
        lines = readRawFileData(filePath,sl,el)

        return jsonify(lines), 200

    except Exception as e:

        return jsonify({"error": str(e)}), 500
    

@app.route("/api/hdfs/getallfiles")
def get_all_files():
    try:
        files = getAllFiles("/user")

        return jsonify({"files" : files}), 200

    except Exception as e:
        return jsonify({"error":str(e)}), 500
    

@app.route("/api/hdfs/getallpaths")
def get_all_paths():
    try:
        files, dirs = getAllPaths("/user")

        return jsonify({"files": files, "dirs" : dirs}), 200
    except Exception as e:
        return jsonify({"Status": f"Error {e}"}), 500


@app.route("/api/hdfs/deletepath",methods=["POST"])
def delete_path():
    try:
        data = request.get_json()
        path_to_delete = data.get("path")
        is_deleted = deletePath(path_to_delete)

        if is_deleted:
            return jsonify({"deleted": is_deleted, "path" : path_to_delete}), 200
    
        return jsonify({"deleted": is_deleted, "path" : path_to_delete}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/yarn/jobs/<job_id>", methods=["POST"])
def submit_job(job_id):
    data = request.get_json()
    
    try:
        code, res = submitJob(job_id, data.get("inputFile"), data.get("dir"))

        if code == 0:
            return jsonify({"status": f"Job Submitted successfully"}), 200
        
        return jsonify({"error": f" >> {res}"}), 200
        
    except Exception as e:
        return jsonify({"error" : str(e)}), 500
    


if __name__ =="__main__":
    app.run(debug=True)