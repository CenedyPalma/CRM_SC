import { getTenantHeaders } from "../../lib/auth";
import { DocumentsClient } from "./DocumentsClient";

export default async function DocumentsPage({
  searchParams
}: {
  searchParams: { folderId?: string }
}) {
  const folderId = searchParams.folderId || 'root';
  
  // Fetch folders in the current directory
  const foldersRes = await fetch(`http://localhost:3020/folders?parentId=${folderId}`, { cache: "no-store", headers: await getTenantHeaders() });
  
  // Fetch documents in the current directory
  const documentsRes = await fetch(`http://localhost:3020/documents?folderId=${folderId}`, { cache: "no-store", headers: await getTenantHeaders() });
  
  // Fetch current folder metadata (if not root) for breadcrumbs
  let currentFolder = null;
  if (folderId !== 'root') {
    const currentFolderRes = await fetch(`http://localhost:3020/folders/${folderId}`, { cache: "no-store", headers: await getTenantHeaders() });
    if (currentFolderRes.ok) {
      currentFolder = await currentFolderRes.json();
    }
  }

  const initialFolders = foldersRes.ok ? await foldersRes.json() : [];
  const initialDocuments = documentsRes.ok ? await documentsRes.json() : [];

  return (
    <DocumentsClient 
      initialFolders={initialFolders} 
      initialDocuments={initialDocuments} 
      currentFolder={currentFolder}
      currentFolderId={folderId}
    />
  );
}
