import Client from 'ssh2-sftp-client';
import path from 'path';

async function deploy(localDir, remoteDir) {
  const sftp = new Client();
  try {
    console.log(`\n⏳ Connexion au FTP pour déployer vers ${remoteDir}...`);
    await sftp.connect({
      host: 'ftp.cluster121.hosting.ovh.net',
      port: 22,
      username: 'artfasq',
      password: 'ArtFasq12345'
    });
    console.log(`✅ Connecté ! Envoi des fichiers de ${localDir} vers ${remoteDir}...`);
    
    // Si c'est la racine, on tente de supprimer l'ancien index.html d'OVH qui peut bloquer
    if (remoteDir === 'www' || remoteDir === './www' || remoteDir === '/www') {
      try {
        await sftp.delete(`${remoteDir}/index.html`);
        console.log(`🗑️ Ancien index.html supprimé.`);
      } catch(e) {
        // Ignorer si le fichier n'existe pas
      }
    }
    
    // Le 2ème argument 'remoteDir' indique où envoyer.
    await sftp.uploadDir(localDir, remoteDir);
    
    console.log(`🚀 Déploiement vers ${remoteDir} terminé avec succès !`);
  } catch (err) {
    console.error(`❌ Erreur lors du déploiement vers ${remoteDir}:`, err.message);
  } finally {
    await sftp.end();
  }
}

async function main() {
  console.log("=== DÉBUT DU DÉPLOIEMENT SUR OVH ===");
  // 1. Déploiement de la boutique (racine)
  await deploy(path.resolve('./apps/storefront/dist'), 'www');
  
  // 2. Déploiement de l'administration (sous-dossier admin)
  await deploy(path.resolve('./apps/admin-cms/dist'), 'www/admin');
  
  console.log("\n🎉 TOUT EST DÉPLOYÉ !");
}

main();
