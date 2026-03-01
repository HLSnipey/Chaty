import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient("https://iacrtcghdzjyageyhpdc.supabase.co/", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhY3J0Y2doZHpqeWFnZXlocGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzM2MzcsImV4cCI6MjA4Nzk0OTYzN30.ukFKi7ewopCOIzyKO8qR7yggdbF1lNFiDJY_782P0Io");

async function signUp() {
  await supabase.auth.signUp({
    email: email.value,
    password: password.value
  });
}

async function signIn() {
  const { data } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });
  if (data.user) initChat();
}

async function initChat() {
  auth.hidden = true;
  chat.hidden = false;

  loadMessages();

  supabase
    .channel("realtime")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      payload => renderMessage(payload.new)
    )
    .subscribe();
}

async function loadMessages() {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("inserted_at", { ascending: true });

  data.forEach(renderMessage);
}

async function sendMessage() {
  const user = (await supabase.auth.getUser()).data.user;
  await supabase.from("messages").insert({
    content: msgInput.value,
    user_id: user.id
  });
  msgInput.value = "";
}

function renderMessage(msg) {
  const div = document.createElement("div");
  div.textContent = msg.content;
  messages.appendChild(div);
}