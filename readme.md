## How to test:
Start: npm run start -- --username=your_username or script2 in package.json
1. Create a "test" directory in your root
2. Create a directory "folder" in the test directory
3. cd test/folder - go to the test folder
4. add example.txt - create a new txt file
5. ls - look at the files in the folder
6. compress example.txt archive.br - archive the file
7. decompress archive.br example.txt - unzip the file
8. cat example.txt - look at the contents of your empty file
9. rn example.txt renamed.txt - rename the file
10. cp renamed.txt ../ - copy the file to the test folder
11. up - go to a higher level
12. rm folder/renamed.txt - delete the renamed.txt file in the folder
13. mv renamed.txt folder - move the file from the test folder to the folder
14. hash folder/renamed.txt - get the hash of the file
15. os - view information about the OS using the suggested keys, for example --cpus,

## Teams

### Navigation & Working Directory:
- up: Move one level up.
- cd path_to_directory: Go to the specified directory.
- ls: List files and folders in the current directory.

### Basic operations with files:
- cat path_to_file: Output the contents of the file.
- add new_file_name: Create a new empty file.
- rn path_to_file new_filename: Rename the file.
- cp path_to_file path_to_new_directory: Copying a file.
- mv path_to_file path_to_new_directory: Move a file.
- rm path_to_file: Delete a file.

### Operating System Info:
- os --EOL: Receive and output the operating system end-of-line character.
- os --cpus: Receive and display information about processors.
- os --homedir: Get and display the user's home directory.
- os --username: Get and display the name of the current system user.
- os --architecture: Get and display the processor architecture.

### Hash Calculation:
- hash path_to_file: Calculate and output the file hash.

### Compress and Decompress Operations:
- compress path_to_file path_to_destination: File compression.
- decompress path_to_file path_to_destination: Decompress the file.