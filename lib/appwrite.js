import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
// import {EC2_IP_ADDRESS} from "@env"

// export const appwriteConfig = {
//   endpoint: "https://cloud.appwrite.io/v1",
//   platform: "com.phin.aora",
//   projectId: "6627a282ab714f25acd8",
//   databaseId: "6627a9c7b0d34bb3643d",
//   userCollectionId: "6627ab31b9ca8f842d2d",
//   videoCollectionId: "6627ab871b62a4b3de85",
//   storageId: "6627ae6cc3556b235e22",
// };
export const appwriteConfig = {
  endpoint: "https://appwrite.suvrajitmondal.in/v1",
  platform: "com.phintastic.aora",
  projectId: "667abb32002aaf1107c9",
  databaseId: "667abe8f002de95978de",
  userCollectionId: "667abeed001d675c437e",
  videoCollectionId: "667abfda0017ff000f98",
  storageId: "667ac35d00112a56737c",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = appwriteConfig;

// Init your react-native SDK
const client = new Client();

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export async function createUser({ email, password, userName }) {
  email = email.trim(" ");
  password = password.trim(" ");
  userName = userName.trim(" ");
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      userName
    );

    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(userName);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        userName: userName,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

  // account.create(ID.unique(), email, password, userName).then(
  //   function (response) {
  //     console.log(response);
  //   },
  //   function (error) {
  //     console.log(error);
  //   }
  // );
}

export const signIn = async (email, password) => {
  email = email.trim(" ");
  password = password.trim(" ");
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      ); //width, height,  ,quality
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error("Invalid file type");
  }
};

export const uploadFile = async (file, type) => {
  if (!file) return;

  const { fileName, mimeType, fileSize, uri } = file;

  const asset = {
    name: fileName,
    type: mimeType,
    size: fileSize,
    uri: uri,
  };

  try {
    const uploadFile = await storage.createFile(storageId, ID.unique(), asset);
    const fileUrl = await getFilePreview(uploadFile.$id, type);

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const createVideo = async (
  { thumbnail, video, title, prompt },
  userId
) => {
  if (!userId) {
    throw new Error("User not found", { statusCode: 404 });
  }

  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(thumbnail, "image"),
      uploadFile(video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: prompt,
        users: userId,
      }
    );
    // if(!newPost) return
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt", Query.limit(7)),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchedPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("users", userId),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const likeVideo = async (userId, videoId) => {
  if (!userId || !videoId) {
    throw new Error("User not found");
  }

  try {
    const video = await databases.getDocument(
      databaseId,
      videoCollectionId,
      videoId
    );

    if (!video) {
      throw new Error("Video not found");
    }

    let currentLikes = video.like.map((likes) => likes.$id) || [];

    if (currentLikes.includes(userId)) {
      currentLikes = currentLikes.filter((id) => id !== userId);
    } else {
      currentLikes.push(userId);
    }

    const result = await databases.updateDocument(
      databaseId,
      videoCollectionId,
      videoId,
      {
        like: currentLikes,
      }
    );

    return result;
  } catch (error) {
    console.error("Error liking video:", error);
    throw new Error(error.message);
  }
};

export const getAllLikedVideos = async (userId) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);
    const likedPosts = posts.documents.filter((post) =>
      post.like.some((likeObj) => likeObj.$id === userId)
    );
    // console.log(posts.documents);
    return likedPosts;
  } catch (error) {
    throw new Error(error);
  }
};

const getFileIdFromUrl = (url) => {
  const isDefaultDp = url.includes("initials");
  if (isDefaultDp) return null;

  const urlParts = url.split("/");
  // The file ID is the second to last part of the URL path
  const fileId = urlParts[8];
  return fileId;
};

export const changeNewDpImage = async (newDpImage, userId, dp) => {
  if (!userId && !newDpImage && !dp) {
    throw new Error("Not found", { statusCode: 404 });
  }

  try {
    const oldDpFileId = getFileIdFromUrl(dp);
    if (!oldDpFileId) {
      const newDpImageUrl = await uploadFile(newDpImage, "image");

      const newProfile = await databases.updateDocument(
        databaseId,
        userCollectionId,
        userId,
        {
          avatar: newDpImageUrl,
        }
      );
      return newProfile;
    } else {
      if (!oldDpFileId) return;
      await storage.deleteFile(storageId, oldDpFileId);
      const newDpImageUrl = await uploadFile(newDpImage, "image");
      const newProfile = await databases.updateDocument(
        databaseId,
        userCollectionId,
        userId,
        {
          avatar: newDpImageUrl,
        }
      );
      return newProfile;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userDetails = await databases.getDocument(
      databaseId,
      userCollectionId,
      userId
    );
    if (!userDetails) return null;
    return userDetails;
  } catch (error) {
    console.log(error);
  }
};
