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



print(getAllFiles("/user"))

#print(getAllDirs(["/user"]))
