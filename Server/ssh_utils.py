import paramiko
from paramiko.ssh_exception import SSHException, NoValidConnectionsError
import time

import subprocess


def sendSSHCommand(command: str):
    # Create SSH client
    ssh = paramiko.SSHClient()
    ssh.load_system_host_keys()  # Loads keys from ~/.ssh/known_hosts
    ssh.set_missing_host_key_policy(paramiko.RejectPolicy())
    # Connect to remote server
    try:
        ssh.connect(
            hostname='localhost',
            port=2222,          
            username='esam',
            password='izot2001reis'
        )

        stdin, stdout, stderr = ssh.exec_command(command)

        err = stderr.read().decode().strip()
        out = stdout.read().decode().strip()

        if err:
            return 1,err
        
        return 0, out

    except Exception as e:
        return -1, "Connection Error"

    finally:
        ssh.close()

def toggleHDFS(toggle: bool=False):
    operation = "start" if toggle else "stop"
    
    command = f"/bin/bash -lc '/home/esam/hadoop/sbin/{operation}-dfs.sh'"

    code, msg = sendSSHCommand(command)

    return {code, msg}

def toggleYarn(toggle: bool=False):
    operation = "start" if toggle else "stop"
    
    command = f"/bin/bash -lc '/home/esam/hadoop/sbin/{operation}-yarn.sh'"

    code, msg = sendSSHCommand(command)

    return {code, msg}

def isHadoopRunning():

    code, msg = sendSSHCommand("jps")

    return code ,["NameNode" and "DataNode" in msg, "ResourceManager" and "NodeManager" in msg]

def submitJob(job_id : str, inputFilePath: str, outputDirPath: str):

    jar_path = JobsPaths.get(job_id)

    if jar_path is None:
        return 1, f"'{job_id}' not found."

    try:
        command = f"/home/esam/hadoop/bin/hadoop jar {jar_path} {inputFilePath} {outputDirPath}"

        code , msg = sendSSHCommand(command)

        return code, msg

    except Exception as e:
        raise e
    

JobsPaths = {
    "1" : "/media/sf_New_folder/jobs/MovieRatingsCount.jar",
    "2" : "/media/sf_New_folder/jobs/MovieMinMaxRatings",
    "3" : "/media/sf_New_folder/jobs/MovieRatingsAverage",
    "4" : "/media/sf_New_folder/jobs/MovieRatingsStdDeviation",
    "5" : "/media/sf_New_folder/jobs/MovieRatingsCV",
    "6" : "/media/sf_New_folder/jobs/MovieRatingSkewness"
}