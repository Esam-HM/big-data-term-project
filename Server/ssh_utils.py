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

def main():
    #status, res = sendSSHCommand('/home/esam/hadoop/bin/hadoop jar /media/sf_New_folder/ParcticeOne.jar /user/esam/input/data.txt /user/esam/deneJar')

    # if status == 0:
    #     print(f"successf:  {res}")
    # else:
    #     print(f"Error happend: {res}")

    code, result = sendSSHCommand("/bin/bash -lc '/home/esam/hadoop/sbin/start-dfs.sh'")
    if code == 0:
        print("HDFS started:", result)
    else:
        print("Failed to start HDFS:", result)


if __name__ == "__main__":
    main()