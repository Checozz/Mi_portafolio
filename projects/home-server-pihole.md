# Servidor Casero · Self-Hosted Suite

Tenía una laptop vieja juntando polvo. En lugar de tirarla, la convertí en un **servidor 24/7** corriendo Ubuntu Server. Lo uso todos los días.

## Lo que corre dentro

- **Pi-hole** — bloqueo de anuncios a nivel de red para toda mi casa
- **WireGuard VPN** — me conecto desde donde sea a mi red local
- **Acceso remoto a mi PC principal** vía la VPN, como si estuviera en casa
- Backups programados de proyectos importantes

## Por qué

Tener tu propia infraestructura te enseña cómo funcionan las cosas por debajo. Cada vez que algo se cae a las 3am aprendo algo nuevo. La red doméstica completa pasa por filtros que yo definí — y eso se siente bien.

## Stack

`Ubuntu Server` · `Pi-hole` · `WireGuard` · `systemd` · `SSH` · `iptables`
