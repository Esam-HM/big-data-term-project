from hdfs import InsecureClient, HdfsError
import os

client = InsecureClient("http://192.168.56.102:9870", user="esam")

def paginate(page: int, size: int):
    start = (page-1)*size
    
    return start, start+size

# Read file from HDFS
def readFile(filePath: str, startLine: int, endLine: int):
    """
    Read lines from HDFS file between startLine and endLine (zero-based, end exclusive).

    :param filePath: Path to the HDFS file.
    :param startLine: First line index to read (inclusive).
    :param endLine: Last line index to read (exclusive).
    """

    lines = []
    try:
        with client.read(filePath, encoding="utf-8", delimiter="\n") as reader:
            for i, line in enumerate(reader):
                if i>=startLine and i<endLine:
                    lines.append(line.split("\t"))
                
                elif i>=endLine:
                    break

        return lines            
    
    except Exception as e:
        raise e

def readRawFileData(filePath: str, startLine: int, endLine: int):
    lines = []
    try:
        with client.read(filePath, encoding="utf-8", delimiter="\n") as reader:
            for i, line in enumerate(reader):
                if i>=startLine and i<endLine:
                    lines.append(line)
                
                elif i>=endLine:
                    break

        return lines            
    
    except Exception as e:
        raise e
    

def countLines(filePath: str):
    """
    """
    totalLines = 0
    try:
        with client.read(filePath, encoding="utf-8", delimiter="\n") as reader:
            for line in reader:
                totalLines +=1

        return totalLines           
    
    except Exception as e:
        raise e
            

def writeFile(targetPath: str, file_stream):
    """
    Upload file stream directly to HDFS at targetPath.
    """
    try:
        with client.write(targetPath, overwrite=False) as writer:
            # Read the incoming file stream in chunks and write to HDFS
            chunk_size = 1024 * 1024  # 1 MB
            while True:
                chunk = file_stream.read(chunk_size)
                if not chunk:
                    break
                writer.write(chunk)
        return targetPath
    except Exception as e:
        # handle or log error as needed
        raise e

def deletePath(hdfs_path: str):
    """
    Delete file or directory.
    """
    try:
        was_deleted = client.delete(hdfs_path, recursive=False)
        
        return was_deleted
    
    except Exception as e:
        raise e
    
def createDirectory(hdfs_path: str):
    """
    Create new directory. subdirs will be created if not existed
    """
    try:
        client.makedirs(hdfs_path)
        return 0
    except Exception as e:
        raise e


def getAllDirs(dirs: list):
    try:
        all_dirs = []

        for dir in dirs:
            entries = client.list(dir, status=True)
            subdirs = [
                f"{dir}/{name}"
                for name, status in entries
                if status['type'] == 'DIRECTORY'
            ]

            all_dirs.extend(subdirs) 
            all_dirs.extend(getAllDirs(subdirs))

        return all_dirs

    except Exception as e:
        return -1

def getAllFiles(path="/"):
    all_files = []

    try:
        # List directory contents with metadata
        entries = client.list(path, status=True)

        for name, status in entries:
            full_path = path + "/" + name


            if status['type'] == 'DIRECTORY':
                # Recursively traverse subdirectory
                all_files.extend(getAllFiles(full_path))
            elif status['type'] == 'FILE':
                # It's a file, add to list
                all_files.append(full_path)

        return all_files

    except Exception as e:
        raise e
    
def getAllPaths(path="/"):
    all_files = []
    all_dirs = []

    try:
        # List directory contents with metadata
        entries = client.list(path, status=True)

        for name, status in entries:
            full_path = path + "/" + name

            if status['type'] == 'DIRECTORY':
                # Recursively traverse subdirectory
                all_dirs.append(full_path)
                files, dirs = getAllPaths(full_path)
                all_files.extend(files)
                all_dirs.extend(dirs)
            elif status['type'] == 'FILE':
                # It's a file, add to list
                all_files.append(full_path)

        return all_files, all_dirs

    except Exception as e:
        raise e
    
# List files in an HDFS directory
def listDirectory(hdfsPath: str):
    return client.list(hdfsPath)


# Rename or move a file/directory
def movePath(hdfsSrc: str, hdfsDst: str):
    try:
        client.rename(hdfsSrc, hdfsDst)
        return 0

    except HdfsError as e:
        return -1


# Check if a path exists
def exists(hdfsPath: str):
    try:
        status = client.status(hdfsPath, strict=False)
        return status is not None
    except:
        return False

# # Write raw string data to HDFS
# def writeText(hdfsPath: str, data: str):
#     with client.write(hdfsPath, encoding='utf-8', overwrite=True) as writer:
#         writer.write(data)
#     return hdfsPath

# # Upload local file to HDFS
# def writeFile(targetPath: str, filePath: str):
#     uploadedPath = client.upload(targetPath, filePath, overwrite=True)
#     return uploadedPath

# # Read raw string data from HDFS
# def readText(hdfsPath: str):
#     with client.read(hdfsPath, encoding='utf-8') as reader:
#         return reader.read()

# # Delete file or directory from HDFS
# def deletePath(hdfsPath: str):
#     return client.delete(hdfsPath, recursive=True)
