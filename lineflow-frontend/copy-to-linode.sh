# Learn: These notes added to archlinux doc (search for: "Public Files Server")
# Learn: Below command was required for once only so that I can copy file via `scp`.
# sudo chown -R user1: /var/www/lineflow-frontend/
# scp -r ./* linode.user1:/var/www/lineflow-frontend/

# Only copying index.html file for releases purpose
scp -r ./index.html linode.user1:/var/www/lineflow-frontend/