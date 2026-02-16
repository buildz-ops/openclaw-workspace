# ASO Exam Cheat Sheet — Standalone Edition
**Ayoub Ammar Chaibi | DNI: 44XX | Pass Strategy**

---

## 🎯 Exam Overview

**3 Exams, 3 Hours Total, ~18 Points**
- **LDAP** (6 pts) — 70 min target
- **SSH/VNC** (6 pts) — 60 min target  
- **Samba/NFS** (6 pts) — 50 min target

**Goal:** Get 9-10 points total = PASS (50-60% per exam)

**Every Screenshot Needs:**
1. Your full name: Ayoub Ammar Chaibi
2. Proof internet is disconnected (unplug cable or `ip a` showing no gateway)
3. Command + output visible

**Machine Credentials (All Machines):**
- User: `isard`
- Pass: `pirineus`

---

## 📋 EXAM 1: LDAP (6 Points)

### What You're Building
A company directory called `NewCompany.local` with departments and users that can log in across machines.

### Step-by-Step Workflow

#### **SERVER SETUP (Do This First)**

##### 1. Install LDAP Server (5 min)
```bash
# Install packages
sudo apt update
sudo apt install slapd ldap-utils

# Configure base domain
sudo dpkg-reconfigure slapd
# When prompted:
# - Omit OpenLDAP config? NO
# - DNS domain: NewCompany.local
# - Organization: NewCompany
# - Admin password: (choose something, write it down!)
# - Database: MDB
# - Remove database when purged? NO
# - Move old database? YES
```

**Test it works:**
```bash
ldapsearch -x -b "dc=NewCompany,dc=local"
# Should show the base entry, not errors
```

---

##### 2. Create Directory Structure (15 min)

**Create this file:** `structure.ldif`

```ldif
# Base organizational units
dn: ou=departments,dc=NewCompany,dc=local
objectClass: organizationalUnit
ou: departments

dn: ou=people,dc=NewCompany,dc=local
objectClass: organizationalUnit
ou: people

# IT Department
dn: ou=it,ou=departments,dc=NewCompany,dc=local
objectClass: organizationalUnit
ou: it

# Marketing Department
dn: ou=marketing,ou=departments,dc=NewCompany,dc=local
objectClass: organizationalUnit
ou: marketing

# HR Department
dn: ou=hr,ou=departments,dc=NewCompany,dc=local
objectClass: organizationalUnit
ou: hr

# Groups
dn: cn=it,ou=departments,dc=NewCompany,dc=local
objectClass: posixGroup
cn: it
gidNumber: 6100

dn: cn=marketing,ou=departments,dc=NewCompany,dc=local
objectClass: posixGroup
cn: marketing
gidNumber: 6200

dn: cn=hr,ou=departments,dc=NewCompany,dc=local
objectClass: posixGroup
cn: hr
gidNumber: 6300

# Users
dn: uid=jordi.valentin,ou=people,dc=NewCompany,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: top
cn: Jordi Valentin
sn: Valentin
uid: jordi.valentin
uidNumber: 7000
gidNumber: 6100
homeDirectory: /home/jordi.valentin
loginShell: /bin/bash
userPassword: password123
telegramID: @jordidev

dn: uid=juan.morego,ou=people,dc=NewCompany,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: top
cn: Juan Morego
sn: Morego
uid: juan.morego
uidNumber: 7001
gidNumber: 6300
homeDirectory: /home/juan.morego
loginShell: /bin/bash
userPassword: password123

dn: uid=xenia.castella,ou=people,dc=NewCompany,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: top
cn: Xenia Castella
sn: Castella
uid: xenia.castella
uidNumber: 7002
gidNumber: 6200
homeDirectory: /home/xenia.castella
loginShell: /bin/bash
userPassword: password123
mobile: +34666777888
description: Marketing specialist

dn: uid=robot.build,ou=people,dc=NewCompany,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: top
cn: Robot Build
sn: Build
uid: robot.build
uidNumber: 7100
gidNumber: 6100
homeDirectory: /home/robot.build
loginShell: /usr/sbin/nologin
userPassword: password123
```

**Import it:**
```bash
ldapadd -x -D "cn=admin,dc=NewCompany,dc=local" -W -f structure.ldif
# Enter the admin password you set earlier
```

**Verify:**
```bash
ldapsearch -x -b "dc=NewCompany,dc=local" "(uid=jordi.valentin)"
# Should show jordi's full entry
```

---

##### 3. Modifications (10 min)

**Task 1: Change robot.build shell to /bin/bash**

Create `modify-robot.ldif`:
```ldif
dn: uid=robot.build,ou=people,dc=NewCompany,dc=local
changetype: modify
replace: loginShell
loginShell: /bin/bash
```

Apply:
```bash
ldapmodify -x -D "cn=admin,dc=NewCompany,dc=local" -W -f modify-robot.ldif
```

**Task 2: Add jordi.valentin to marketing group**

Create `add-jordi-marketing.ldif`:
```ldif
dn: cn=marketing,ou=departments,dc=NewCompany,dc=local
changetype: modify
add: memberUid
memberUid: jordi.valentin
```

Apply:
```bash
ldapmodify -x -D "cn=admin,dc=NewCompany,dc=local" -W -f add-jordi-marketing.ldif
```

**Verify:**
```bash
ldapsearch -x -b "dc=NewCompany,dc=local" "(cn=marketing)"
# Should show jordi.valentin in memberUid
```

---

##### 4. Search Query (5 min)

**Find users in ou=people with /bin/bash and NO mobile attribute:**

```bash
ldapsearch -x -b "ou=people,dc=NewCompany,dc=local" "(&(objectClass=posixAccount)(loginShell=/bin/bash)(!(mobile=*)))"
```

**Should return:** jordi.valentin, juan.morego, robot.build  
**Should NOT return:** xenia.castella (has mobile)

---

##### 5. Create Consultants Group (For Ex 3)

Create `consultants.ldif`:
```ldif
dn: cn=consultants,ou=departments,dc=NewCompany,dc=local
objectClass: posixGroup
cn: consultants
gidNumber: 6400
```

Import:
```bash
ldapadd -x -D "cn=admin,dc=NewCompany,dc=local" -W -f consultants.ldif
```

**Add xenia to consultants:**

Create `add-xenia-consultants.ldif`:
```ldif
dn: cn=consultants,ou=departments,dc=NewCompany,dc=local
changetype: modify
add: memberUid
memberUid: xenia.castella
```

Apply:
```bash
ldapmodify -x -D "cn=admin,dc=NewCompany,dc=local" -W -f add-xenia-consultants.ldif
```

---

#### **CLIENT SETUP (New Machine)**

##### 6. Configure LDAP Client (15 min)

**Install packages:**
```bash
sudo apt update
sudo apt install libnss-ldap libpam-ldap ldap-utils nscd
```

**During installation, enter:**
- LDAP server URI: `ldap://SERVER_IP` (replace SERVER_IP with actual server IP)
- Base DN: `dc=NewCompany,dc=local`
- LDAP version: 3
- Make local root Database admin: NO
- Does LDAP database require login: NO

**Configure NSS (Name Service Switch):**
```bash
sudo nano /etc/nsswitch.conf
```

**Find these lines and change them:**
```
passwd:         files systemd ldap
group:          files systemd ldap
shadow:         files ldap
```

**Configure LDAP client:**
```bash
sudo nano /etc/ldap.conf
```

**Add/verify these lines:**
```
base dc=NewCompany,dc=local
uri ldap://SERVER_IP
ldap_version 3
pam_password md5
```

**Restart nscd:**
```bash
sudo systemctl restart nscd
```

**Test it works:**
```bash
getent passwd jordi.valentin
# Should show: jordi.valentin:x:7000:6100:Jordi Valentin:/home/jordi.valentin:/bin/bash

getent group it
# Should show: it:*:6100:

getent group consultants
# Should show: consultants:*:6400:xenia.castella
```

**If not working, troubleshoot:**
```bash
# Check nscd is running
sudo systemctl status nscd

# Restart it
sudo systemctl restart nscd

# Test LDAP connectivity
ldapsearch -x -H ldap://SERVER_IP -b "dc=NewCompany,dc=local" "(uid=jordi.valentin)"
```

---

##### 7. Configure PAM for Home Directory Creation (5 min)

**Why:** When LDAP users log in, they need a home directory created automatically.

```bash
sudo nano /etc/pam.d/common-session
```

**Add this line at the END:**
```
session optional pam_mkhomedir.so skel=/etc/skel umask=0077
```

**Test it:**
```bash
# Try to login as xenia
su - xenia.castella
# Enter password: password123

# Check home directory was created
ls -la /home/xenia.castella
# Should show home directory contents
```

---

##### 8. JXplorer Validation (10 min)

**What it is:** A GUI tool to browse LDAP visually (like a file explorer for directories).

**Install:**
```bash
sudo apt install jxplorer
```

**Launch:**
```bash
jxplorer &
```

**Connect to LDAP:**
1. Click **"Connect"** button (or File → Connect)
2. Fill in connection details:
   - **Host:** `SERVER_IP`
   - **Port:** `389`
   - **Protocol:** LDAP v3
   - **Base DN:** `dc=NewCompany,dc=local`
   - **Level:** User + Password
   - **User DN:** `cn=admin,dc=NewCompany,dc=local`
   - **Password:** (your admin password)
3. Click **OK**

**Navigate to xenia.castella:**
1. In left panel, expand: `dc=NewCompany,dc=local`
2. Expand: `ou=people`
3. Click: `uid=xenia.castella`

**What to screenshot:**
- Right panel should show:
  - **DN:** `uid=xenia.castella,ou=people,dc=NewCompany,dc=local`
  - **objectClass:** `inetOrgPerson`, `posixAccount`, `top`
  - **gidNumber:** `6200`
  - **uid:** `xenia.castella`

**Verify she's in marketing:**
1. Navigate to: `ou=departments` → `cn=marketing`
2. Right panel should show:
   - **memberUid:** (should include `jordi.valentin` if you did step 3)
   - **gidNumber:** `6200`

---

##### 9. Deletion (If Asked - Skip if Time is Tight)

**Delete HR group and users:**

```bash
# Delete juan.morego (HR user)
ldapdelete -x -D "cn=admin,dc=NewCompany,dc=local" -W "uid=juan.morego,ou=people,dc=NewCompany,dc=local"

# Delete HR group
ldapdelete -x -D "cn=admin,dc=NewCompany,dc=local" -W "cn=hr,ou=departments,dc=NewCompany,dc=local"

# Delete HR organizational unit
ldapdelete -x -D "cn=admin,dc=NewCompany,dc=local" -W "ou=hr,ou=departments,dc=NewCompany,dc=local"
```

---

### LDAP Key Concepts (Quick Reference)

**LDIF File Structure:**
- `dn:` = Distinguished Name (full path to object)
- `objectClass:` = What type of object this is
- `ou:` = Organizational Unit (like a folder)
- `cn:` = Common Name (like a group or admin)
- `uid:` = User ID (username)
- `uidNumber:` = Unix user ID number (must be unique)
- `gidNumber:` = Unix group ID number
- `memberUid:` = Username of group member

**Common Errors:**
- **getent returns nothing:** NSS not configured, check `/etc/nsswitch.conf`
- **Can't login:** PAM not configured, check `/etc/pam.d/common-session`
- **Permission denied:** Check LDAP admin password is correct
- **Already exists:** Object was imported before, delete first with `ldapdelete`

---

## 📋 EXAM 2: SSH + VNC (6 Points)

### What You're Building
Secure remote access: SSH with keys only, VNC desktop sharing through SSH tunnel.

---

### SSH SECTION (3.5 points)

#### 1. Static IP Configuration (5 min)

**On SERVER (PREFIXsrv):**
```bash
# Find your network interface name
ip a
# Look for something like: enp0s3, eth0, ens33

# Edit netplan config
sudo nano /etc/netplan/01-netcfg.yaml
```

**Add this (replace `enp0s3` with your interface):**
```yaml
network:
  version: 2
  ethernets:
    enp0s3:
      dhcp4: no
      addresses:
        - 192.168.44.10/24
      gateway4: 192.168.44.1
      nameservers:
        addresses:
          - 8.8.8.8
```

**Apply:**
```bash
sudo netplan apply
ip a  # Verify IP is 192.168.44.10
```

**On CLIENT (PREFIXpc):**
```bash
sudo nano /etc/netplan/01-netcfg.yaml
```

**Add:**
```yaml
network:
  version: 2
  ethernets:
    enp0s3:
      dhcp4: no
      addresses:
        - 192.168.44.20/24
      gateway4: 192.168.44.1
      nameservers:
        addresses:
          - 8.8.8.8
```

**Apply:**
```bash
sudo netplan apply
ip a  # Verify IP is 192.168.44.20
```

**Test connectivity:**
```bash
# From client, ping server
ping -c 3 192.168.44.10

# From server, ping client
ping -c 3 192.168.44.20
```

---

#### 2. Name Resolution (5 min)

**On BOTH machines:**
```bash
sudo nano /etc/hosts
```

**Add:**
```
192.168.44.10   acsrv   acsrv.local
192.168.44.20   acpc    acpc.local
```

**Test:**
```bash
# From client
ping -c 2 acsrv

# From server
ping -c 2 acpc
```

---

#### 3. SSH Key Authentication (10 min)

**On CLIENT:**

**Create user 'tecnic':**
```bash
sudo adduser tecnic
# Password: (choose something)
```

**On SERVER:**

**Create user 'tecnic':**
```bash
sudo adduser tecnic
```

**On CLIENT (as tecnic user):**
```bash
# Switch to tecnic
su - tecnic

# Generate SSH key pair
ssh-keygen -t rsa -b 4096
# Press Enter 3 times (no passphrase, default location)

# Copy public key to server
ssh-copy-id tecnic@192.168.44.10
# Enter tecnic's password on server
```

**On SERVER (configure SSH):**
```bash
sudo nano /etc/ssh/sshd_config
```

**Find and change these lines (or add if missing):**
```
# Only allow public key authentication
PubkeyAuthentication yes
PasswordAuthentication no

# Only allow tecnic user
AllowUsers tecnic

# Disable root login
PermitRootLogin no
```

**Restart SSH:**
```bash
sudo systemctl restart sshd
```

**Test from CLIENT:**
```bash
# Should work WITHOUT password
ssh tecnic@192.168.44.10

# Try with wrong user (should fail)
ssh isard@192.168.44.10
# Should say: Permission denied
```

---

#### 4. Change SSH Port + Firewall (10 min)

**On SERVER:**
```bash
sudo nano /etc/ssh/sshd_config
```

**Change:**
```
Port 2222
```

**Restart SSH:**
```bash
sudo systemctl restart sshd
```

**Configure UFW firewall:**
```bash
# Install UFW if not present
sudo apt install ufw

# Allow SSH from client only
sudo ufw allow from 192.168.44.20 to any port 2222

# Block SSH from everywhere else
sudo ufw deny 2222

# Enable firewall
sudo ufw enable
# Type 'y' when asked

# Check rules
sudo ufw status numbered
```

**Test from CLIENT:**
```bash
# Connect with new port
ssh -p 2222 tecnic@192.168.44.10
# Should work

# From SERVER, try to SSH to itself (should fail because not from 192.168.44.20)
ssh -p 2222 tecnic@localhost
# Should timeout or be denied
```

---

#### 5. Banner + Timeout (10 min)

**On SERVER:**

**Create banner file:**
```bash
sudo nano /etc/issue.net
```

**Add this text:**
```
⚠️ AVÍS DE SEGURETAT ⚠️
Accés restringit. Només per a personal autoritzat.
Totes les connexions i activitats poden ser registrades.
L'ús indegut serà reportat.
```

**Configure SSH to use banner:**
```bash
sudo nano /etc/ssh/sshd_config
```

**Add/change:**
```
Banner /etc/issue.net
ClientAliveInterval 300
ClientAliveCountMax 2
```

**What this means:**
- `ClientAliveInterval 300` = Check every 5 minutes (300 sec)
- `ClientAliveCountMax 2` = After 2 failed checks (10 min total), disconnect

**Restart SSH:**
```bash
sudo systemctl restart sshd
```

**Test from CLIENT:**
```bash
ssh -p 2222 tecnic@192.168.44.10
# Should show banner BEFORE password prompt

# Once logged in, wait 10+ minutes without typing
# Connection should close automatically
```

---

#### 6. Troubleshoot SSH Keys (5 min)

**Simulate broken permissions:**
```bash
# On SERVER, as tecnic
chmod 777 ~/.ssh
chmod 666 ~/.ssh/authorized_keys
```

**Try to connect from CLIENT:**
```bash
ssh -p 2222 tecnic@192.168.44.10
# Should FAIL (will ask for password, but PasswordAuth is off)
```

**Check logs on SERVER:**
```bash
sudo journalctl -u sshd -n 50
# Look for: "Authentication refused: bad ownership or modes"
```

**Fix it:**
```bash
# On SERVER
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

**Test again:**
```bash
# From CLIENT
ssh -p 2222 tecnic@192.168.44.10
# Should work now
```

---

### VNC SECTION (2.5 points)

#### 1. Install and Configure VNC (10 min)

**On SERVER:**
```bash
# Install packages
sudo apt update
sudo apt install tightvncserver xfce4 xfce4-goodies
```

**Set VNC password:**
```bash
vncpasswd
# Password: ammarchaibi
# Verify: ammarchaibi
# View-only password: n
```

**Create startup script:**
```bash
nano ~/.vnc/xstartup
```

**Add this:**
```bash
#!/bin/bash
xrdb $HOME/.Xresources
startxfce4 &
```

**Make it executable:**
```bash
chmod +x ~/.vnc/xstartup
```

---

#### 2. Start VNC with Settings (5 min)

**Start VNC server:**
```bash
vncserver :1 -geometry 1280x800 -depth 24 -localhost
```

**What this means:**
- `:1` = Display number 1 (port 5901)
- `-geometry 1280x800` = Screen resolution
- `-depth 24` = Color depth (24-bit)
- `-localhost` = Only accept connections from localhost (security)

**Verify it's running:**
```bash
ps aux | grep vnc
# Should show Xtightvnc process

netstat -tuln | grep 5901
# Should show port 5901 listening on 127.0.0.1
```

**Stop VNC (if needed):**
```bash
vncserver -kill :1
```

---

#### 3. Wireshark Capture (5 min)

**On SERVER:**
```bash
# Install Wireshark
sudo apt install wireshark

# Launch Wireshark
sudo wireshark &
```

**In Wireshark:**
1. Select interface (probably `Loopback: lo` for localhost testing)
2. Click **Start Capture** (blue shark fin icon)
3. In filter bar, type: `tcp.port == 5901`
4. Press Enter

**Now connect via VNC (from CLIENT through SSH tunnel - see next step)**

**In Wireshark:**
- Should see VNC traffic
- Right-click packet → Follow → TCP Stream
- Should see RFB protocol data (VNC protocol)

**Screenshot:** Wireshark showing VNC packets

---

#### 4. SSH Tunnel for VNC (10 min)

**Why:** VNC is unencrypted. SSH tunnel encrypts the connection.

**On CLIENT:**
```bash
# Create SSH tunnel
ssh -L 5901:localhost:5901 -p 2222 tecnic@192.168.44.10
# Keep this terminal open!
```

**What this does:**
- `-L 5901:localhost:5901` = Forward local port 5901 to server's localhost:5901
- Client connects to `localhost:5901` → encrypted through SSH → server's VNC at `localhost:5901`

**Install VNC viewer on CLIENT:**
```bash
sudo apt install remmina
```

**Connect:**
```bash
remmina &
```

**In Remmina:**
1. Click **+** (New connection)
2. Protocol: **VNC**
3. Server: `localhost:5901`
4. Username: (leave empty)
5. Password: `ammarchaibi`
6. Click **Connect**

**Should see:** Server's desktop in VNC window

---

#### 5. Troubleshooting (5 min)

**Gray screen problem:**

**If you see gray screen instead of desktop:**
```bash
# On SERVER, check xstartup
cat ~/.vnc/xstartup
# Should have: startxfce4 &

# Check XFCE is installed
dpkg -l | grep xfce4
# Should show xfce4-session, xfce4-panel, etc.

# Kill VNC and restart
vncserver -kill :1
vncserver :1 -geometry 1280x800 -depth 24 -localhost
```

**Authentication error:**
```bash
# Re-set VNC password
vncpasswd
# Password: ammarchaibi
```

**Two security improvements:**
1. ✅ Already done: `-localhost` flag (only local connections)
2. ✅ Already done: SSH tunnel (encryption)
3. **Extra:** Use view-only password for monitoring:
   ```bash
   vncpasswd
   # View-only password: readonly123
   ```

---

## 📋 EXAM 3: Samba + NFS (6 Points)

### What You're Building
File sharing: Samba (Windows-compatible), NFS (Linux native).

**Your identifiers:**
- **XX:** 44 (from DNI)
- **InicialNom-XX-Cognom:** `A-44-Ammar`
- **Full name:** Ayoub Ammar Chaibi

---

### SAMBA SECTION (3.5 points)

#### 1. Static IPs (Already Done in SSH Exam)

**Use same IPs:**
- Server: `192.168.44.10`
- Client: `192.168.44.20`

**Test:**
```bash
ping -c 2 192.168.44.10  # From client
ping -c 2 192.168.44.20  # From server
```

---

#### 2. Create User and Directories (10 min)

**On SERVER:**
```bash
# Create Linux user
sudo adduser A-44-Ammar
# Password: (choose something)

# Create Samba user (SEPARATE from Linux password)
sudo smbpasswd -a A-44-Ammar
# New SMB password: samba123
# Retype: samba123

# Create shared directories
sudo mkdir -p /srv/compartit-A-44-Ammar/public
sudo mkdir -p /srv/compartit-A-44-Ammar/privat

# Set ownership
sudo chown -R A-44-Ammar:A-44-Ammar /srv/compartit-A-44-Ammar

# Set permissions
sudo chmod 755 /srv/compartit-A-44-Ammar/public   # Everyone can read
sudo chmod 700 /srv/compartit-A-44-Ammar/privat   # Only owner

# Verify
ls -ld /srv/compartit-A-44-Ammar/*
```

---

#### 3. Configure Samba (15 min)

**On SERVER:**
```bash
# Install Samba
sudo apt update
sudo apt install samba

# Backup original config
sudo cp /etc/samba/smb.conf /etc/samba/smb.conf.backup

# Edit config
sudo nano /etc/samba/smb.conf
```

**Scroll to bottom and add:**
```ini
[public-A-44-Ammar]
   path = /srv/compartit-A-44-Ammar/public
   browseable = yes
   guest ok = yes
   read only = no
   create mask = 0755

[privat-A-44-Ammar]
   path = /srv/compartit-A-44-Ammar/privat
   browseable = yes
   guest ok = no
   valid users = A-44-Ammar
   read only = no
   create mask = 0700
   hosts allow = 192.168.44.20

[readonly-A-44-Ammar]
   path = /srv/compartit-A-44-Ammar/public
   browseable = yes
   guest ok = yes
   read only = yes
```

**Test config:**
```bash
testparm
# Should say: "Loaded services file OK."
# Shows your shares
```

**Restart Samba:**
```bash
sudo systemctl restart smbd nmbd
sudo systemctl status smbd
```

---

#### 4. Test Samba Access (10 min)

**On CLIENT:**
```bash
# Install Samba client
sudo apt install smbclient cifs-utils

# List shares
smbclient -L //192.168.44.10 -N
# Should show: public-A-44-Ammar, privat-A-44-Ammar, readonly-A-44-Ammar

# Test public share (anonymous)
smbclient //192.168.44.10/public-A-44-Ammar -N
# Should connect
smb: \> ls
smb: \> exit

# Test private share (needs auth)
smbclient //192.168.44.10/privat-A-44-Ammar -U A-44-Ammar
# Password: samba123
smb: \> ls
smb: \> put /etc/hosts test.txt  # Upload test file
smb: \> ls  # Verify
smb: \> exit

# Mount private share
sudo mkdir -p /mnt/samba-privat
sudo mount -t cifs -o username=A-44-Ammar //192.168.44.10/privat-A-44-Ammar /mnt/samba-privat
# Password: samba123

# Test write access
echo "test" | sudo tee /mnt/samba-privat/test.txt
ls -l /mnt/samba-privat/
```

---

#### 5. Security Restrictions (Already in Config Above)

**Verify restrictions work:**

**From CLIENT:**
```bash
# Try to access privat from wrong IP (should work since you're 192.168.44.20)
smbclient //192.168.44.10/privat-A-44-Ammar -U A-44-Ammar
# Should work

# Try readonly share
smbclient //192.168.44.10/readonly-A-44-Ammar -N
smb: \> ls  # Should work
smb: \> put /etc/hosts test.txt  # Should FAIL (read only)
```

---

#### 6. Diagnose Samba (5 min)

**On SERVER:**
```bash
# Check service status
sudo systemctl status smbd

# Check recent logs
sudo journalctl -u smbd -n 50

# Check who's connected
sudo smbstatus
```

**Common error: Can't connect**
```bash
# Check firewall
sudo ufw status
# If active, allow Samba:
sudo ufw allow from 192.168.44.20 to any port 445
sudo ufw allow from 192.168.44.20 to any port 139

# Check Samba users
sudo pdbedit -L
# Should show: A-44-Ammar

# If not, add again:
sudo smbpasswd -a A-44-Ammar
```

---

### NFS SECTION (2.5 points)

#### 1. Install NFS Server (5 min)

**On SERVER:**
```bash
sudo apt update
sudo apt install nfs-kernel-server

# Check status
sudo systemctl status nfs-kernel-server
```

---

#### 2. Create NFS Export (10 min)

**On SERVER:**
```bash
# Create directory
sudo mkdir -p /srv/nfs-A-44-Ammar

# Set ownership (nobody:nogroup = any user can access)
sudo chown nobody:nogroup /srv/nfs-A-44-Ammar
sudo chmod 755 /srv/nfs-A-44-Ammar

# Configure exports
sudo nano /etc/exports
```

**Add this line:**
```
/srv/nfs-A-44-Ammar 192.168.44.20(rw,sync,no_root_squash,no_subtree_check)
```

**What this means:**
- `192.168.44.20` = Only this client can access
- `rw` = Read-write access
- `sync` = Write to disk before responding (safer)
- `no_root_squash` = Client root = server root (normally avoid in production)
- `no_subtree_check` = Faster, less secure

**Apply exports:**
```bash
sudo exportfs -arv
# Should show: exporting 192.168.44.20:/srv/nfs-A-44-Ammar
```

**Restart NFS:**
```bash
sudo systemctl restart nfs-kernel-server
```

---

#### 3. Mount NFS on Client (10 min)

**On CLIENT:**
```bash
# Install NFS client
sudo apt install nfs-common

# Create mount point
sudo mkdir -p /mnt/nfs-A-44-Ammar

# Mount NFS share
sudo mount 192.168.44.10:/srv/nfs-A-44-Ammar /mnt/nfs-A-44-Ammar

# Verify mount
df -h | grep nfs
# Should show: 192.168.44.10:/srv/nfs-A-44-Ammar mounted on /mnt/nfs-A-44-Ammar

# Test write access
sudo touch /mnt/nfs-A-44-Ammar/test-file.txt
echo "NFS works!" | sudo tee /mnt/nfs-A-44-Ammar/test-file.txt

# Verify on SERVER
ls -l /srv/nfs-A-44-Ammar/
cat /srv/nfs-A-44-Ammar/test-file.txt
```

---

#### 4. Diagnose NFS (10 min)

**On CLIENT:**
```bash
# Show exported shares from server
showmount -e 192.168.44.10
# Should show: /srv/nfs-A-44-Ammar  192.168.44.20
```

**On SERVER:**
```bash
# Show active exports
sudo exportfs -v
# Should show your export with options

# Check NFS logs
sudo journalctl -u nfs-server -n 50

# Check what's mounted by clients
sudo cat /proc/fs/nfsd/clients/*/info
```

**Common error: Access denied**

**Problem:** Client can't mount or can't write

**Fix:**
```bash
# On SERVER, check exports file
cat /etc/exports
# Verify IP is correct: 192.168.44.20

# Re-export
sudo exportfs -arv

# Check firewall
sudo ufw allow from 192.168.44.20 to any port nfs

# Check directory permissions
ls -ld /srv/nfs-A-44-Ammar
# Should be: drwxr-xr-x  nobody nogroup
```

---

#### 5. Security Improvements

**Current config (exam):**
```
/srv/nfs-A-44-Ammar 192.168.44.20(rw,sync,no_root_squash,no_subtree_check)
```

**Production config (safer):**
```
/srv/nfs-A-44-Ammar 192.168.44.20(rw,sync,root_squash,no_subtree_check)
```

**What changed:**
- `no_root_squash` → `root_squash` (client root becomes server nobody)

**Best practices:**
1. ✅ Limit by IP (`192.168.44.20` only)
2. ⚠️ Use `root_squash` in production (client root can't own server files)
3. ✅ Use `sync` (safer writes)
4. **Optional:** Use `ro` (read-only) for sensitive data

**Update exports if asked:**
```bash
sudo nano /etc/exports
# Change no_root_squash → root_squash

sudo exportfs -arv
```

---

## 🚨 Common Errors & Quick Fixes

### LDAP
| Error | Cause | Fix |
|---|---|---|
| `getent passwd` shows nothing | NSS not configured | Add `ldap` to `/etc/nsswitch.conf` lines, restart `nscd` |
| Can't login with LDAP user | No home directory creation | Add `pam_mkhomedir.so` to `/etc/pam.d/common-session` |
| ldapadd fails "Already exists" | Entry already imported | Delete first: `ldapdelete -x -D "cn=admin,..." -W "dn"` |
| Connection refused | Server not running | `sudo systemctl start slapd` |

### SSH
| Error | Cause | Fix |
|---|---|---|
| Permission denied (publickey) | Wrong `.ssh` permissions | `chmod 700 ~/.ssh`, `chmod 600 ~/.ssh/authorized_keys` |
| Connection refused | Wrong port or firewall | Check `sshd_config Port`, verify UFW allows port |
| Banner not showing | Wrong file path | Verify `/etc/issue.net` exists, check `sshd_config Banner` line |
| Timeout not working | Wrong interval values | `ClientAliveInterval 300`, `ClientAliveCountMax 2` |

### VNC
| Error | Cause | Fix |
|---|---|---|
| Gray screen | No desktop environment | Install `xfce4`, update `~/.vnc/xstartup` with `startxfce4 &` |
| Connection refused | VNC not running | Start: `vncserver :1 -geometry 1280x800 -depth 24 -localhost` |
| Can't connect remotely | `-localhost` flag | Must use SSH tunnel: `ssh -L 5901:localhost:5901 user@server` |
| Authentication failed | Wrong password | Re-run: `vncpasswd` |

### Samba
| Error | Cause | Fix |
|---|---|---|
| NT_STATUS_ACCESS_DENIED | User not in Samba database | `sudo smbpasswd -a username` |
| Can't browse shares | Firewall blocking | `sudo ufw allow from CLIENT_IP to any port 445` |
| Config error | Syntax mistake | Run `testparm`, fix reported errors |
| Can't write to share | Wrong directory permissions | `sudo chown username:username /path`, `chmod 755 /path` |

### NFS
| Error | Cause | Fix |
|---|---|---|
| Permission denied | Wrong IP in exports | Edit `/etc/exports`, verify client IP, run `sudo exportfs -arv` |
| Mount fails | Server not exporting | On server: `sudo exportfs -arv`, check `showmount -e SERVER_IP` |
| Can't write | Wrong ownership | `sudo chown nobody:nogroup /srv/nfs-path` |
| Stale file handle | Export changed while mounted | On client: `sudo umount /mnt/path`, remount |

---

## ⚡ Exam Day Execution Checklist

### First 10 Minutes (READ ALL EXAMS)
- [ ] Disconnect network cable (REQUIRED for grading)
- [ ] Open all 3 exam PDFs
- [ ] Skim each exam, note which exercises you recognize
- [ ] Decide exam order (suggest: LDAP → SSH/VNC → Samba/NFS)

### During Each Exam
- [ ] Screenshot EVERY step with your name visible
- [ ] Test EVERY command before moving to next step
- [ ] If stuck >5 min, SKIP and come back later
- [ ] Save work frequently to `/home/isard/Documents/`

### Screenshot Requirements (EVERY CAPTURE)
1. Terminal with your name: `echo "Ayoub Ammar Chaibi"`
2. Network disconnected proof: `ip a` (no gateway) or unplugged cable visible
3. Command + output clearly visible
4. Date/time visible (optional but helpful)

### Last 30 Minutes (DOCUMENT FINALIZATION)
- [ ] Create 3 markdown files: `LDAP.md`, `SSH-VNC.md`, `Samba-NFS.md`
- [ ] For each exercise: Command → Screenshot → Result
- [ ] Check all files are in `/home/isard/Documents/`
- [ ] Do final pass: any easy points left?

### Time Management
| Exam | Target Time | Minimum Points | Priority Exercises |
|---|---|---|---|
| LDAP | 70 min | 3.5/6 | Ex 1 (LDIF import), Ex 2 (Client config + JXplorer) |
| SSH/VNC | 60 min | 3.5/6 | SSH 1-4 (IPs, keys, port), VNC 1-2 (basic setup) |
| Samba/NFS | 50 min | 3/6 | Samba 1-3 (user, shares), NFS 1-3 (export, mount) |
| Buffer | 20 min | - | Screenshots, docs, catch-up |

**Total:** 200 min (3h 20m) — leaves 10 min buffer

---

## 🎯 Pass Strategy Summary

**You need ~9-10 points to pass (50-55% total).**

**Guaranteed points (if you execute basics):**
- LDAP: Structure import (2 pts) + Client setup (2 pts) = **4 pts**
- SSH: IPs + Keys + Port (2.2 pts) + Basic VNC (1 pt) = **3.2 pts**
- Samba: User + Shares (1.8 pts) + NFS mount (1.6 pts) = **3.4 pts**

**Total: 10.6 points = PASS with margin**

**What to skip if time is tight:**
- LDAP Ex 3 (troubleshooting consultants)
- LDAP Ex 4 (PAM test)
- SSH Task 5 (banner/timeout)
- VNC Tasks 3-5 (Wireshark, tunnel, troubleshooting)
- All "diagnosis" and "security improvements" sections

**Focus on:** Get basic functionality working, document it clearly, move on.

---

## 📞 Emergency Commands (Keep on Sticky Note)

```bash
# Restart any service
sudo systemctl restart SERVICE_NAME

# Check service status
sudo systemctl status SERVICE_NAME

# View recent logs
sudo journalctl -u SERVICE_NAME -n 50

# Check network
ip a
ping 192.168.44.10

# LDAP test
getent passwd
ldapsearch -x -b "dc=NewCompany,dc=local" "(uid=USERNAME)"

# SSH test
ssh -p 2222 user@host

# Samba test
smbclient -L //SERVER_IP -U username

# NFS test
showmount -e SERVER_IP

# Check what's running
ps aux | grep SERVICE_NAME

# Check listening ports
sudo netstat -tuln | grep PORT_NUMBER
```

---

**You got this. Print this doc, follow it step by step, and you'll pass. 💪**

**Last check:** Did you print this? Go do it now. Then sleep. Tomorrow you execute.
