import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const { VITE_API_ENDPOINT } = import.meta.env;

const initialState = {
  status: "",
  error: "",
  conversations: [],
  activeConversation: {},
  messages: [],
  notifications: [],
  files: [],
};

export const getConversations = createAsyncThunk(
  "conversation/all",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${VITE_API_ENDPOINT}/api/v1/conversation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const openCreateConversation = createAsyncThunk(
  "conversation/openCreate",
  async (values, { rejectWithValue }) => {
    const { token, receiverId } = values;
    try {
      const { data } = await axios.post(
        `${VITE_API_ENDPOINT}/api/v1/conversation`,
        { receiverId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const getConversationMessages = createAsyncThunk(
  "conversation/messages",
  async (values, { rejectWithValue }) => {
    const { token, convoId } = values;
    try {
      const { data } = await axios.get(
        `${VITE_API_ENDPOINT}/api/v1/message/${convoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
export const sendMessage = createAsyncThunk(
  "message/send",
  async (values, { rejectWithValue }) => {
    const { token, convoId, message, files } = values;
    try {
      const { data } = await axios.post(
        `${VITE_API_ENDPOINT}/api/v1/message/`,
        { message, convoId, files },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (store, action) => {
      store.activeConversation = action.payload;
    },
    updateMessages: (store, action) => {
      let convo = store.activeConversation;
      if (convo._id === action.payload.conversation._id) {
        store.messages = [...store.messages, action.payload];
      }
      // update conversation to show latest message
      let conversation = {
        ...action.payload.conversation,
        latestMessage: action.payload,
      };
      let newConvos = [...store.conversations].filter(
        (c) => c._id !== conversation._id
      );
      newConvos.unshift(conversation);
      store.conversations = newConvos;
    },
    addFiles: (store, action) => {
      store.files = [...store.files, action.payload];
    },
    clearFiles: (store) => {
      store.files = [];
    },
    removeFileFromFiles: (state, action) => {
      let index = action.payload;
      let files = [...state.files];
      let fileToRemove = [files[index]];
      state.files = files.filter((file) => !fileToRemove.includes(file));
    },
  },
  extraReducers(builder) {
    builder.addCase(getConversations.pending, (store) => {
      store.status = "loading";
    });
    builder.addCase(getConversations.fulfilled, (store, action) => {
      store.status = "success";
      store.conversations = action.payload;
    });
    builder.addCase(getConversations.rejected, (store, action) => {
      store.status = "failed";
      store.error = action.payload;
    });
    // open/create conversation
    builder.addCase(openCreateConversation.pending, (store) => {
      store.status = "loading";
    });
    builder.addCase(openCreateConversation.fulfilled, (store, action) => {
      store.status = "success";
      store.activeConversation = action.payload;
    });
    builder.addCase(openCreateConversation.rejected, (store, action) => {
      store.status = "failed";
      store.error = action.payload;
    });
    // get conversation messages
    builder.addCase(getConversationMessages.pending, (store) => {
      store.status = "loading";
    });
    builder.addCase(getConversationMessages.fulfilled, (store, action) => {
      store.status = "success";
      store.messages = action.payload;
    });
    builder.addCase(getConversationMessages.rejected, (store, action) => {
      store.status = "failed";
      store.error = action.payload;
    });
    // send message
    builder.addCase(sendMessage.pending, (store) => {
      store.status = "loading";
    });
    builder.addCase(sendMessage.fulfilled, (store, action) => {
      store.status = "success";
      store.messages = [...store.messages, action.payload];
      let conversation = {
        ...action.payload.conversation,
        latestMessage: action.payload,
      };
      let newConvos = [...store.conversations].filter(
        (c) => c._id !== conversation._id
      );
      newConvos.unshift(conversation);
      store.conversations = newConvos;
    });
    builder.addCase(sendMessage.rejected, (store, action) => {
      store.status = "failed";
      store.error = action.payload;
    });
  },
});
export const {
  setActiveConversation,
  updateMessages,
  addFiles,
  clearFiles,
  removeFileFromFiles,
} = chatSlice.actions;
export default chatSlice.reducer;
