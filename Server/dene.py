# import paramiko
# from paramiko.ssh_exception import SSHException, NoValidConnectionsError

# # Create SSH client
# ssh = paramiko.SSHClient()
# ssh.load_system_host_keys()  # Loads keys from ~/.ssh/known_hosts
# ssh.set_missing_host_key_policy(paramiko.RejectPolicy())
# # Connect to remote server
# try:
#     ssh.connect(
#         hostname='localhost',
#         port=2222,                # Your VM port
#         username='esam',
#         password='izot2001reis'  # Or use key_filename='path_to_private_key'
#     )
#     stdin, stdout, stderr = ssh.exec_command('jps')

#     if(stderr):
#         print(f"Error: {stderr.read().decode()}")

#     if(stdout):
#         print(f"Output: {stdout.read().decode()}")

# except SSHException as e:
#     pass
# except NoValidConnectionsError as ee:
#     print("Connection ERROR")

# finally:
#     ssh.close()
## 10.0.2.15


# from hdfs import InsecureClient

# client = InsecureClient("http://192.168.56.102:9870", user="esam")

# #print(client.list("/user/esam/avrageOutput"))

# with client.read("/user/esam/deneJar/part-r-00000", encoding='utf-8') as reader:
#     content = reader.read()
#     all = content.split("\n")
#     print(all)

from hdfs_services import *
from ssh_utils import sendSSHCommand, toggleYarn, isHadoopRunning, submitJob

#files, dirs = getAllPaths("/user")
#print(f"Files : {files}")
#print(f"Dirs: {dirs}")
#print(getAllFiles("/user"))
#print(getAllDirs(["/user"]))

# def dene():
#     status, res = sendSSHCommand('/home/esam/hadoop/bin/hadoop jar /media/sf_New_folder/ParcticeOne.jar /user/esam/input/data.txt /user/esam/deneJar')

#     if status == 0:
#         print(f"successf:  {res}")
#     else:
#         print(f"Error happend: {res}")
        
        
#     code, result = sendSSHCommand("/bin/bash -lc '/home/esam/hadoop/sbin/start-dfs.sh'")
    
#     if code == 0:
#         print("HDFS started:", result)
#     else:
#         print("Failed to start HDFS:", result)

def main():
    JobsPaths = {
        "1" : "/media/sf_New_folder/jobs/MovieRatingsCount.jar",
        "2" : "/media/sf_New_folder/jobs/MovieMinMaxRatings",
        "3" : "/media/sf_New_folder/jobs/MovieRatingsAverage",
        "4" : "/media/sf_New_folder/jobs/MovieRatingsStdDeviation",
        "5" : "/media/sf_New_folder/jobs/MovieRatingsCV",
        "6" : "/media/sf_New_folder/jobs/MovieRatingSkewness"
    }

    inputFilePath = "/user/esam/input/data.txt"
    outputDirPath = "/user/esam/jobsResults/MovieRatingsAverage"

    command = f"/home/esam/hadoop/bin/hadoop jar {JobsPaths.get("3")} {inputFilePath} {outputDirPath}"
    print(command)

def readHDFSFile():
    start, stop = paginate(1,200)
    print(readFile("/user/esam/input/movies_25.csv",start,stop))
    start, stop = paginate(2,200)
    print("break")
    print(readFile("/user/esam/input/movies_25.csv",start,stop))
    #print(countLines("/user/esam/input/movies_25.csv"))




if __name__ == "__main__":
    #readHDFSFile()
    print(submitJob("2","/user/esam/input/data.csv","/user/esam/minmax1"))