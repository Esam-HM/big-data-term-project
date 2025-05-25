from flask import Flask, jsonify, request
from flask_cors import CORS
from hdfs_services import *
from ssh_utils import toggleHDFS, isHadoopRunning
from werkzeug.utils import secure_filename

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


@app.route("/api/hdfs/getDirs", methods=["GET"])
def getDirs():
    allDirs = getAllDirs(["/user"])

    if allDirs == -1:
        return jsonify({"error": "connection error"}), 500
    

    return jsonify({"dirs": allDirs})


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

@app.route("/api/hdfs/getallfiles")
def get_all_files():
    try:
        files = getAllFiles("/user")

        return jsonify({"files" : files}), 200

    except Exception as e:
        return jsonify({"files":[]}), 500

@app.route("api/hdfs/deletepath",methods=["POST"])
def delete_path():
    try:
        data = request.get_json()
        path_to_delete = data.get["path"]
        is_deleted = deletePath(path_to_delete)

        if is_deleted:
            return jsonify({"deleted": is_deleted, "path" : path_to_delete}), 200
    
        return jsonify({"deleted": is_deleted, "path" : path_to_delete}), 200
        
    except:
        return jsonify({"deleted": "-", "path": "-"}), 500

@app.route("/api/hdfs/createdirs",methods=["POST"])
def create_dirs():
    try:
        data = request.get_json()
        dirs = data.get["path"]

        res = createDirectories("dirs")

        return jsonify({"status": f"Directories Created at {dirs}"}), 200
    
    except:

        return jsonify({"status": "Error wile creating dirs"}), 500


if __name__ =="__main__":
    app.run(debug=True)