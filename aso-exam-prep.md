# ASO Exam Prep — Pass with a 5 Strategy 🎯

**Exam:** Tomorrow evening (3h practical in Isard)  
**Setup:** 1 Server + 1 Client (Ubuntu, pre-installed)  
**Goal:** Pass all 3 RAs (LDAP, SSH/VNC, Samba/NFS) — aim for 5, not perfection

---

## 🚨 Critical Mindset

- **No internet access** → commands must be memorized or on cheat sheet
- **3 hours total** → ~1h per RA, prioritize essentials
- **Evidence is king** → every step needs a capture with your name + internet disconnected proof
- **User/Pass:** `isard` / `pirineus` (all machines)

---

## 📋 Exam Breakdown

| RA | Topic | Points | Priority | Time Budget |
|---|---|---|---|---|
| **RA1** | LDAP + PAM | 6 pts | HIGH | 70 min |
| **RA4** | SSH + VNC | 6 pts | HIGH | 60 min |
| **RA4** | Samba + NFS | 6 pts | MEDIUM | 50 min |

**Pass threshold:** ~9-10/18 points = **3-3.5 points per exam minimum**

---

## 🎯 Essential Commands Cheat Sheet (Print This!)

### **LDAP Essentials (RA1)**

#### Server Setup
```bash
# Install packages
sudo apt install slapd ldap-utils

# Reconfigure base DN
sudo dpkg-reconfigure slapd

# Import LDIF
ldapadd -x -D "cn=admin,dc=NewCompany,dc=local" -W -f file.ldif

# Modify existing entry
ldapmodify -x -D "cn=admin,dc=NewCompany,dc=local" -W -f changes.ldif

# Delete entry
ldapdelete -x -D "cn=admin,dc=NewCompany,dc=local" -W "dn_to_delete"

# Search LDAP
ldapsearch -x -b "dc=NewCompany,dc=local" "(filter)"
ldapsearch -x -b "dc=NewCompany,dc=local" "(&(ou=people)(loginShell=/bin/bash)(!(mobile=*)))"
```

#### Client Setup (Critical for Passing!)
```bash
# Install client packages
sudo apt install libnss-ldap libpam-ldap ldap-utils nscd

# Configure NSS to query LDAP
sudo nano /etc/nsswitch.conf
# Change lines:
passwd:         files systemd ldap
group:          files systemd ldap
shadow:         files ldap

# Configure LDAP client
sudo nano /etc/ldap.conf
# Add:
base dc=NewCompany,dc=local
uri ldap://SERVER_IP
ldap_version 3

# Restart nscd
sudo systemctl restart nscd

# Test resolution
getent passwd
getent group

# PAM auto-home directory
sudo nano /etc/pam.d/common-session
# Add at the end:
session optional pam_mkhomedir.so skel=/etc/skel umask=077

# PAM LDAP password change
sudo pam-auth-update --enable ldap
```

#### JXplorer (GUI Validation)
```bash
# Install
sudo apt install jxplorer

# Launch
jxplorer

# Connection:
# Host: ldap://SERVER_IP:389
# Protocol: LDAP v3
# Base DN: dc=NewCompany,dc=local
# User DN: cn=admin,dc=NewCompany,dc=local
# Password: [admin password]
```

---

### **SSH Essentials (RA4)**

```bash
# Install SSH
sudo apt install openssh-server

# Config file
sudo nano /etc/ssh/sshd_config

# Key changes:
Port 2222
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AllowUsers tecnic
Banner /etc/issue.net
ClientAliveInterval 300
ClientAliveCountMax 2

# Restart SSH
sudo systemctl restart sshd

# Generate SSH keys (client)
ssh-keygen -t rsa -b 4096

# Copy public key to server
ssh-copy-id -p 2222 tecnic@SERVER_IP

# UFW firewall rules
sudo ufw allow from CLIENT_IP to any port 2222
sudo ufw deny 2222
sudo ufw enable
sudo ufw status

# Banner
sudo nano /etc/issue.net
# Paste the warning message

# Test connection
ssh -p 2222 tecnic@SERVER_IP

# Diagnose issues
sudo journalctl -u sshd -n 50
ls -la ~/.ssh  # Check permissions (700 for .ssh, 600 for authorized_keys)
```

---

### **VNC Essentials (RA4)**

```bash
# Install TightVNC
sudo apt install tightvncserver

# Set password (use your surnames as password)
vncpasswd

# Configure startup
nano ~/.vnc/xstartup
# Add:
#!/bin/bash
xrdb $HOME/.Xresources
startxfce4 &

# Make executable
chmod +x ~/.vnc/xstartup

# Start VNC server
vncserver :1 -geometry 1280x800 -depth 24 -localhost

# Stop VNC
vncserver -kill :1

# SSH tunnel (from client)
ssh -L 5901:localhost:5901 isard@SERVER_IP

# Connect with VNC client
# Connect to: localhost:5901

# Wireshark filter
tcp.port == 5900 || tcp.port == 5901

# Gray screen fix
sudo apt install xfce4 xfce4-goodies
# Then reconfigure xstartup
```

---

### **Samba Essentials (RA4)**

```bash
# Install Samba
sudo apt install samba

# Create user and directories
sudo useradd -m InicialNom-XX-Cognom
sudo mkdir -p /srv/compartit-InicialNom-XX-Cognom/{public,privat}
sudo chown -R InicialNom-XX-Cognom:InicialNom-XX-Cognom /srv/compartit-InicialNom-XX-Cognom
sudo chmod 755 /srv/compartit-InicialNom-XX-Cognom/public
sudo chmod 700 /srv/compartit-InicialNom-XX-Cognom/privat

# Add Samba user
sudo smbpasswd -a InicialNom-XX-Cognom

# Configure Samba
sudo nano /etc/samba/smb.conf

# Add shares:
[public-InicialNom-XX-Cognom]
   path = /srv/compartit-InicialNom-XX-Cognom/public
   guest ok = yes
   browseable = yes
   read only = no

[privat-InicialNom-XX-Cognom]
   path = /srv/compartit-InicialNom-XX-Cognom/privat
   valid users = InicialNom-XX-Cognom
   guest ok = no
   browseable = yes
   read only = no
   hosts allow = 192.168.XX.20

# Test config
testparm

# Restart Samba
sudo systemctl restart smbd nmbd

# Test from client
smbclient -L //SERVER_IP -U InicialNom-XX-Cognom
smbclient //SERVER_IP/privat-InicialNom-XX-Cognom -U InicialNom-XX-Cognom

# Mount on client
sudo apt install cifs-utils
sudo mount -t cifs -o username=InicialNom-XX-Cognom //SERVER_IP/privat-InicialNom-XX-Cognom /mnt/samba

# Diagnose
sudo journalctl -u smbd -n 50
```

---

### **NFS Essentials (RA4)**

```bash
# Install NFS server
sudo apt install nfs-kernel-server

# Create export directory
sudo mkdir -p /srv/nfs-InicialNom-XX-Cognom
sudo chown nobody:nogroup /srv/nfs-InicialNom-XX-Cognom

# Configure exports
sudo nano /etc/exports
# Add:
/srv/nfs-InicialNom-XX-Cognom 192.168.XX.20(rw,sync,no_root_squash,no_subtree_check)

# Apply exports
sudo exportfs -arv

# Restart NFS
sudo systemctl restart nfs-kernel-server

# Client side
sudo apt install nfs-common
sudo mkdir -p /mnt/nfs-InicialNom-XX-Cognom
sudo mount SERVER_IP:/srv/nfs-InicialNom-XX-Cognom /mnt/nfs-InicialNom-XX-Cognom

# Test
df -h
touch /mnt/nfs-InicialNom-XX-Cognom/test.txt

# Diagnose
showmount -e SERVER_IP
sudo exportfs -v
sudo journalctl -u nfs-server -n 50
```

---

## ⚡ Minimum Viable Strategy (To Pass Each Exam)

### **LDAP Exam (6 pts → Target: 3.5 pts minimum)**

**DO FIRST (Must-pass essentials):**
1. ✅ **Ex 1 (2 pts):** Import LDIF structure → Priority is getting users/groups created
   - Focus: Create the LDIF file correctly, import it
   - Skip: Advanced search queries if time is tight
   
2. ✅ **Ex 2 (2 pts):** Client LDAP config + JXplorer validation
   - **CRITICAL:** `getent passwd` must show LDAP users
   - Configure `/etc/nsswitch.conf` and `/etc/ldap.conf`
   - JXplorer validation is easy points (just connect and screenshot)
   - PAM home directory creation (add `pam_mkhomedir.so` line)

**DO SECOND (If time allows):**
3. ⚠️ **Ex 3 (1.25 pts):** Troubleshooting consultants group
   - Only attempt if you have 15+ min left
   
4. ⚠️ **Ex 4 (0.75 pts):** PAM home directory test
   - Quick win if configured correctly in Ex 2

**SKIP IF UNDER TIME:**
- Extra points (1 pt) for document quality → focus on content first

---

### **SSH/VNC Exam (6 pts → Target: 3.5 pts minimum)**

**DO FIRST:**
1. ✅ **SSH Tasks 1-4 (2.2 pts):** Basic SSH setup
   - Static IPs + ping test (0.5 pts) — fast
   - Name resolution (0.4 pts) — fast
   - Public key auth + AllowUsers (0.6 pts) — essential
   - Port 2222 + UFW rules (0.7 pts) — medium effort

2. ✅ **VNC Task 1-2 (1 pt):** Basic VNC setup
   - Configure vncserver with password (0.5 pts)
   - Localhost + display :1 (0.5 pts)

**DO SECOND:**
3. ⚠️ **SSH Task 5 (0.8 pts):** Banner + Timeout
   - Only if you have 20+ min left

**DO LAST:**
4. ⚠️ **VNC Tasks 3-5 (1.5 pts):** Wireshark, SSH tunnel, troubleshooting
   - These are bonus points; prioritize Samba/NFS if time is tight

---

### **Samba/NFS Exam (6 pts → Target: 3 pts minimum)**

**DO FIRST:**
1. ✅ **Samba Tasks 1-3 (1.8 pts):**
   - Static IPs (0.5 pts) — fast
   - User + directories (0.5 pts) — fast
   - Basic Samba config (0.8 pts) — essential

2. ✅ **NFS Tasks 1-3 (1.6 pts):**
   - Enable NFS service (0.4 pts) — fast
   - Export directory (0.6 pts) — essential
   - Mount on client (0.6 pts) — essential

**DO SECOND:**
3. ⚠️ **Samba Task 4 (0.8 pts):** Security restrictions
   - Only if basic shares are working

**SKIP IF UNDER TIME:**
- Diagnosis tasks (both Samba + NFS)
- Security improvements section

---

## 🔥 Common Pitfalls & Quick Fixes

### LDAP
- **Problem:** `getent passwd` doesn't show LDAP users
  - **Fix:** Check `/etc/nsswitch.conf` has `ldap` after `files`
  - **Fix:** Restart `nscd`: `sudo systemctl restart nscd`

- **Problem:** Can't login with LDAP user
  - **Fix:** Add `pam_mkhomedir.so` to `/etc/pam.d/common-session`
  - **Fix:** Run `sudo pam-auth-update` and enable LDAP

- **Problem:** Group membership not showing
  - **Fix:** Use `ldapmodify` to add `memberUid` attribute
  - **Fix:** Check `gidNumber` matches group definition

### SSH
- **Problem:** Public key auth not working
  - **Fix:** Check `.ssh` permissions: `chmod 700 ~/.ssh` and `chmod 600 ~/.ssh/authorized_keys`
  - **Fix:** Check logs: `sudo journalctl -u sshd -n 50`

- **Problem:** Can't connect after changing port
  - **Fix:** Verify UFW allows the new port
  - **Fix:** Client command: `ssh -p 2222 user@host`

### VNC
- **Problem:** Gray screen on connection
  - **Fix:** Install desktop environment: `sudo apt install xfce4`
  - **Fix:** Update `~/.vnc/xstartup` to start `startxfce4 &`

- **Problem:** Can't connect to VNC
  - **Fix:** Check VNC is running: `ps aux | grep vnc`
  - **Fix:** For localhost-only: use SSH tunnel first

### Samba
- **Problem:** Access denied to share
  - **Fix:** User must exist in both Linux AND Samba: `sudo smbpasswd -a username`
  - **Fix:** Check directory permissions match share config

- **Problem:** Can't browse shares
  - **Fix:** Check firewall allows Samba ports
  - **Fix:** Test config: `testparm`

### NFS
- **Problem:** Permission denied when writing
  - **Fix:** Use `no_root_squash` in `/etc/exports`
  - **Fix:** Check directory ownership: `sudo chown nobody:nogroup /export/path`

- **Problem:** Can't mount on client
  - **Fix:** Check service is running: `sudo systemctl status nfs-kernel-server`
  - **Fix:** Verify exports: `sudo exportfs -v`

---

## 📝 Tonight's Study Plan (Reverse Priority)

### **Phase 1: Core Commands (1.5 hours)**
Print the cheat sheet and **hand-write** these workflows from memory:

1. LDAP client setup (30 min)
   - `/etc/nsswitch.conf` entries
   - `/etc/ldap.conf` base config
   - PAM `pam_mkhomedir.so` line
   - Practice: `getent passwd`, `getent group`

2. SSH security config (30 min)
   - `sshd_config` essential lines (Port, PubkeyAuth, AllowUsers)
   - `ssh-keygen` + `ssh-copy-id` workflow
   - UFW allow/deny pattern

3. Samba basic share (20 min)
   - `smb.conf` share block syntax
   - `smbpasswd -a` command
   - `testparm` and `smbclient -L`

4. NFS export (10 min)
   - `/etc/exports` syntax
   - `exportfs -arv` command
   - Client mount command

### **Phase 2: LDIF Creation (30 min)**
Practice writing LDIF files from scratch:

```ldif
# Example structure
dn: ou=people,dc=NewCompany,dc=local
objectClass: organizationalUnit
ou: people

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
userPassword: password
telegramID: @jordidev
```

### **Phase 3: Error Scenarios (20 min)**
Review these diagnostics commands:
- `sudo journalctl -u SERVICE -n 50`
- `systemctl status SERVICE`
- `ls -la ~/.ssh` (permission checks)
- `testparm` (Samba config)
- `showmount -e SERVER` (NFS exports)

### **Phase 4: Sleep (Go to Bed!)**
Don't stay up all night. You need mental sharpness tomorrow more than cramming.

---

## 🎯 Exam Day Execution

### **Time Allocation (3 hours total)**
- **First 15 min:** Read all 3 exams, annotate priorities on paper
- **Next 70 min:** LDAP exam (aim for 4/6 points)
- **Next 60 min:** SSH/VNC exam (aim for 3.5/6 points)
- **Next 50 min:** Samba/NFS exam (aim for 3/6 points)
- **Last 25 min:** Capture screenshots, document formatting, final checks

### **Screenshot Discipline**
Every capture needs:
1. Your full name visible
2. Proof internet is disconnected (`ip a` showing no gateway, or unplugged cable)
3. Command + output clearly visible
4. Timestamp (optional but helpful)

### **If You Get Stuck (5-Minute Rule)**
- Stuck >5 min on one task? **Skip it.**
- Move to next exercise
- Come back at the end if time allows
- Partial credit > zero credit

### **Document Organization**
Save everything to `/home/isard/Documents/`:
- Create one document per exam (LDAP.md, SSH-VNC.md, Samba-NFS.md)
- Use clear headers: "Exercise 1", "Exercise 2", etc.
- For each exercise:
  ```
  ## Exercise X: Brief Title
  
  **What I did:**
  1. Command 1
  2. Command 2
  
  **Evidence:**
  [Screenshot 1]
  [Screenshot 2]
  
  **Result:** Working / Partial / Not working
  ```

---

## ✅ Pre-Exam Checklist

Night before:
- [ ] Print cheat sheet (commands reference)
- [ ] Write LDIF structure examples on paper
- [ ] Prepare `/etc/nsswitch.conf` snippet
- [ ] Prepare `sshd_config` security block
- [ ] Get 7-8 hours of sleep

Exam day:
- [ ] Arrive 10 min early
- [ ] Verify both machines boot correctly
- [ ] Disconnect network immediately
- [ ] Set up document structure first
- [ ] Read all 3 exams before starting

---

## 💡 Final Tips

1. **Speed Hacks:**
   - Use `history | grep command` to find previous commands
   - Copy-paste from `/usr/share/doc/` example configs when available
   - Use `!!` to repeat last command with `sudo !!`

2. **Mental Game:**
   - Breathe. It's just a lab environment.
   - Passing = 50%, not 100%
   - Every command you remember is points earned

3. **What NOT to Waste Time On:**
   - Perfect documentation formatting (function > form)
   - Extra credit tasks until core is done
   - Troubleshooting minor GUI glitches in VNC

4. **Emergency Fallback:**
   - If LDAP is a disaster, focus all energy on SSH+Samba (12 pts available)
   - If SSH is broken, max out LDAP+NFS instead
   - Don't let one bad RA sink the whole exam

---

## 🚀 You Got This

You're not aiming for perfect. You're aiming for **functional**.

- 5 exercises done well > 10 exercises half-finished
- Basic working config > advanced features with bugs
- Clear evidence > fancy explanations

Tomorrow evening, you walk in, execute the core commands, document the wins, and walk out with a pass.

**Now go print that cheat sheet and get some sleep. 💤**

---

*Last updated: 2026-02-16*  
*Questions? Ask Vex in #aso*
