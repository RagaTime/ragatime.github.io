# Learn: These notes added to archlinux doc (search for: "Public Files Server")

DEPLOY_DIR=multiapp-frontend

# Learn: Creating folder is and changing ownershitp is required for once only
#        so that I can copy file via `scp` via user1
ssh linode.root mkdir -p /var/www/$DEPLOY_DIR
ssh linode.root sudo chown -R user1: /var/www/$DEPLOY_DIR/

# Copy all files
scp -r ./* linode.user1:/var/www/$DEPLOY_DIR/

# Copy only index.html
# scp -r ./index.html linode.user1:/var/www/$DEPLOY_DIR/
