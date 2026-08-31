"""
/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Script de déploiement automatique FTP vers l'hébergement OVH ART FASHION
 * @created 2026-08-31
 * @updated 2026-08-31
 * 🌐 ceo.nexuspartners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */
"""

import os
import sys
import ftplib
import urllib.request
import datetime
from pathlib import Path

FTP_HOST = os.getenv("OVH_FTP_HOST", "ftp.cluster121.hosting.ovh.net")
FTP_PORT = int(os.getenv("OVH_FTP_PORT", "21"))
FTP_USER = os.getenv("OVH_FTP_USER", "artfasq")
FTP_PASS = os.getenv("OVH_FTP_PASS", "ArtFasq12345")

ROOT_DIR = Path(__file__).resolve().parent.parent
STOREFRONT_DIST = ROOT_DIR / "apps" / "storefront" / "dist"
ADMIN_DIST = ROOT_DIR / "apps" / "admin-cms" / "dist"
BACKUP_DIR = ROOT_DIR / ".dexty" / "backups"


def cd_or_create(ftp: ftplib.FTP, remote_dir: str):
    """Assure l'existence d'un dossier distant absolu et s'y positionne."""
    ftp.cwd("/")
    parts = [p for p in remote_dir.strip("/").split("/") if p]
    for part in parts:
        try:
            ftp.cwd(part)
        except ftplib.error_perm:
            print(f"  📁 Création dossier distant : {part}")
            ftp.mkd(part)
            ftp.cwd(part)


def backup_remote_db(ftp: ftplib.FTP):
    """Sauvegarde le fichier db.json distant avant tout déploiement."""
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = BACKUP_DIR / f"db_backup_{timestamp}.json"
    
    try:
        ftp.cwd("/www")
        with open(backup_file, "wb") as f:
            ftp.retrbinary("RETR db.json", f.write)
        print(f"💾 Sauvegarde sécurisée de db.json -> {backup_file.name}")
    except Exception as e:
        print(f"⚠️  Note sauvegarde db.json : {e}")


def upload_single_file(ftp: ftplib.FTP, local_file: Path, target_filename: str):
    """Upload un fichier unique dans le dossier FTP courant."""
    with open(local_file, "rb") as f:
        ftp.storbinary(f"STOR {target_filename}", f)
    size_kb = local_file.stat().st_size / 1024
    print(f"  ⬆️  {target_filename} ({size_kb:.1f} Ko)")


def sync_folder(ftp: ftplib.FTP, local_dir: Path, remote_dir: str, skip_files=None, clean_old=False):
    """Synchronise un dossier local vers un dossier distant cible."""
    if not local_dir.exists():
        print(f"❌ Dossier local introuvable : {local_dir}")
        return

    skip_files = set(skip_files or [])
    
    for root, dirs, files in os.walk(local_dir):
        rel_path = Path(root).relative_to(local_dir)
        target_remote_dir = remote_dir if str(rel_path) == "." else f"{remote_dir}/{rel_path.as_posix()}"
        
        cd_or_create(ftp, target_remote_dir)
        print(f"\n📂 Dossier cible : {target_remote_dir}")

        existing_files = set()
        if clean_old:
            try:
                existing_files = set(f for f in ftp.nlst() if f not in (".", ".."))
            except Exception:
                existing_files = set()

        uploaded_in_dir = set()

        for file_name in files:
            if file_name in skip_files:
                print(f"  ⏭️  Ignoré (protégé) : {file_name}")
                continue

            local_file = Path(root) / file_name
            upload_single_file(ftp, local_file, file_name)
            uploaded_in_dir.add(file_name)

        if clean_old and existing_files:
            for rem_f in existing_files:
                if rem_f not in uploaded_in_dir and rem_f not in skip_files:
                    try:
                        ftp.delete(rem_f)
                        print(f"  🗑️  Suppression ancien asset orphelin : {rem_f}")
                    except Exception as e:
                        print(f"  ⚠️  Impossible de supprimer {rem_f}: {e}")


def main():
    print("=" * 65)
    print("🚀 ART FASHION — DÉPLOIEMENT EN LIGNE OVH")
    print(f"🌐 Cible : {FTP_HOST} (Utilisateur: {FTP_USER})")
    print("=" * 65)

    if not STOREFRONT_DIST.exists() or not ADMIN_DIST.exists():
        print("❌ Les dossiers de build 'dist' sont manquants. Exécutez 'pnpm build' d'abord.")
        sys.exit(1)

    print("\n🔌 Connexion au serveur FTP OVH...")
    ftp = ftplib.FTP()
    ftp.connect(FTP_HOST, FTP_PORT, timeout=30)
    ftp.login(FTP_USER, FTP_PASS)
    print("✅ Authentification FTP réussie !\n")

    # 1. Sauvegarde automatique de db.json
    backup_remote_db(ftp)

    # 2. Déploiement Storefront (Site Vitrine) -> /www
    print("\n" + "─" * 45)
    print("📦 Déploiement Storefront (/www)")
    print("─" * 45)
    protected_files = {"_config.php", "db.json", "uploads", ".htaccess"}
    sync_folder(ftp, STOREFRONT_DIST, "/www", skip_files=protected_files, clean_old=False)

    # 3. Nettoyage spécifique des assets vitrine
    if (STOREFRONT_DIST / "assets").exists():
        print("\n🎨 Synchronisation & Nettoyage Assets Vitrine (/www/assets)")
        sync_folder(ftp, STOREFRONT_DIST / "assets", "/www/assets", clean_old=True)

    # 4. Déploiement Admin CMS -> /www/admin
    print("\n" + "─" * 45)
    print("🛠️  Déploiement Back-Office Admin (/www/admin)")
    print("─" * 45)
    sync_folder(ftp, ADMIN_DIST, "/www/admin", skip_files=protected_files, clean_old=False)

    # 5. Nettoyage spécifique des assets admin
    if (ADMIN_DIST / "assets").exists():
        print("\n🎨 Synchronisation & Nettoyage Assets Admin (/www/admin/assets)")
        sync_folder(ftp, ADMIN_DIST / "assets", "/www/admin/assets", clean_old=True)

    ftp.quit()
    print("\n" + "=" * 65)
    print("🎉 TOUTES LES MISES À JOUR SONT EN LIGNE SUR OVH !")
    print("=" * 65)

    # 6. Vérification HTTP live
    print("\n🔍 Vérification des accès en ligne...")
    urls = [
        ("Vitrine Client", "https://artfashionhome.com/"),
        ("Back-Office Admin", "https://artfashionhome.com/admin/"),
        ("API Auth Status", "https://artfashionhome.com/api/data.php")
    ]
    for label, url in urls:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (DEXTY Healthcheck)"})
            with urllib.request.urlopen(req, timeout=10) as resp:
                print(f"  ✅ {label} : {url} -> Code HTTP {resp.getcode()} OK")
        except urllib.error.HTTPError as e:
            print(f"  ℹ️  {label} : {url} -> Code HTTP {e.code}")
        except Exception as e:
            print(f"  ⚠️  {label} : {url} -> {e}")


if __name__ == "__main__":
    main()
