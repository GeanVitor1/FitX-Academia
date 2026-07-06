using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace FitX.Infrastructure.Hubs;

[Authorize]
public class ChatHub : Hub
{
    public async Task SendMessage(string receiverId, string message)
    {
        var senderId = Context.UserIdentifier;
        await Clients.User(receiverId).SendAsync("ReceiveMessage", senderId, message);
        await Clients.Caller.SendAsync("MessageSent", receiverId, message);
    }

    public async Task JoinConversation(string otherUserId)
    {
        var senderId = Context.UserIdentifier;
        var groupName = string.Compare(senderId, otherUserId) < 0
            ? $"{senderId}_{otherUserId}"
            : $"{otherUserId}_{senderId}";

        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await Clients.Group(groupName).SendAsync("UserJoined", senderId);
    }

    public async Task Typing(string receiverId)
    {
        var senderId = Context.UserIdentifier;
        await Clients.User(receiverId).SendAsync("UserTyping", senderId);
    }
}
