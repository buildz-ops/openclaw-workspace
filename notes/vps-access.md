# VPS Access Log

## Main VPS (OVH)
- **IP:** 57.131.40.85
- **SSH:** ssh root@57.131.40.85 -p 2222 (port changed for security)
- **Access:** Full sudo (NOPASSWD)
- **OS:** Ubuntu 24.04
- **Docker:** Installed ✓
- **SSH Key:** vex00x00@gmail.com

## Security Hardening Applied
- ✅ UFW Firewall enabled (deny incoming, allow outgoing)
- ✅ Ports open: 22, 80, 443, 2222
- ✅ Fail2Ban installed and running
- ✅ Automatic security updates enabled
- ⚠️ SSH key-only auth (recommended but need to test)

## DNS
- **clawtex.com:** Cloudflare - Active ✓
- **clawtex.es:** Cloudflare - Pending nameserver update

## Notes
- Waiting on Arnau for site code
- Need to point DNS to this VPS IP when ready
