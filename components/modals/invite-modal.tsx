"use client";

import axios from "axios";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";

import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogHeader,
} from "@/components/ui/dialog";



export const InviteModal = () => {

	const { isOpen, onClose, type, data, onOpen } = useModal();
	const origin = useOrigin();

	const isModalOpen = isOpen && type === "invite";
	const { server } = data;

	const [copied, setCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl);
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	const onNew = async () => {
		try {
			setIsLoading(true);
			const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

			onOpen("invite", {server: response.data });
		} 
		catch (error) {
			console.log(error);
		}
		finally {
			setIsLoading(false);
		}
	}

	const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px6">
					<DialogTitle className="text-2xl text-center font-bold">
						Invite Friends
					</DialogTitle>
				</DialogHeader>
				<div className="p-6">
					<Label
						className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
					>
						Server Invite Link
					</Label>
					<div className="flex items-center mt-2 gap-x-2">
						<Input 
							disabled={isLoading}
							className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
							value={inviteUrl}
						/>
						<Button disabled={isLoading} onClick={onCopy} size="icon">
							{copied? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
						</Button>
					</div>
					<Button
					onClick={onNew}
					disabled={isLoading}
					variant="link"
					size="sm"
					className="text-xs text-zinc-500 mt-4">
						Generate a new link
						<RefreshCw className="ml-2 w-4 h-4"/>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}