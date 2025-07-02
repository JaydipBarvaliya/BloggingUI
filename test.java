# 🚦 Step 0: Check where origin is currently pointing (it should be Bitbucket)
git remote -v
# Output should show something like:
# origin https://code.td.com/scm/aesig/aesig-common-dal.git

# 🛸 Step 1: Detach from your current branch to safely fetch everything
git checkout --detach

# 🧲 Step 2: Fetch ALL remote branches and create local copies
git fetch origin +refs/heads/*:refs/heads/*

# 🏷️ Step 3: Also fetch tags (if not already)
git fetch origin --tags

# 🚨 Step 4: Change 'origin' to point to GitHub
git remote set-url origin https://github.com/YOUR-ORG-NAME/aesig-common-dal.git

# 🧠 Confirm it's now pointing to GitHub
git remote -v
# Output should now show:
# origin https://github.com/YOUR-ORG-NAME/aesig-common-dal.git

# 🚀 Step 5: Push ALL branches to GitHub
git push --all origin

# 🏷️ Step 6: Push ALL tags to GitHub
git push --tags origin