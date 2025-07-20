"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { useModalStore } from "../../../stores/useModalStore";
import { useCreatePostMutation } from "../../../remote/blog";

export function PostSubmitModal() {
  const { postSubmitModalOpen, setPostSubmitModalOpen } = useModalStore();
  const { mutate: createPost } = useCreatePostMutation();

  const [issueUrl, setIssueUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validateGithubUrl = (url: string) => {
    const githubIssuePattern =
      /^https:\/\/github\.com\/[\w\-.]+\/[\w\-.]+\/(issues|pull)\/\d+$/;
    return githubIssuePattern.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!issueUrl.trim()) {
      setError("GitHub Issue URL을 입력해주세요.");
      return;
    }

    if (!validateGithubUrl(issueUrl)) {
      setError(
        "올바른 GitHub Issue URL 형식이 아닙니다.\n예: https://github.com/username/repo/issues/123"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 실제로는 여기서 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));
      createPost({ issueUrl });
      setIssueUrl("");
      setPostSubmitModalOpen(false);
    } catch (err) {
      setError("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIssueUrl("");
    setError("");
    setPostSubmitModalOpen(false);
  };

  return (
    <Dialog open={postSubmitModalOpen} onOpenChange={setPostSubmitModalOpen}>
      <DialogContent className="max-w-md bg-white">
        <DialogClose onClick={handleClose} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {/* {isCompleted ? ( */}
              {/* <> */}
                {/* <CheckCircle2 className="w-5 h-5 text-diary-accent" /> */}
                {/* 블로그 글 완료! */}
              {/* </> */}
            {/* ) : ( */}
              <>
                <ExternalLink className="w-5 h-5 text-diary-muted" />
                블로그 글 작성 체크
              </>
            {/* )} */}
          </DialogTitle>
          <DialogDescription>
            {/* {isCompleted */}
            {/* ? "이미 이번 달 블로그 글을 완료하셨습니다! 🎉" */}
            {/* : "작성한 블로그 글의 GitHub Issue URL을 제출해주세요."} */}
            작성한 블로그 글의 GitHub Issue URL을 제출해주세요.
          </DialogDescription>
        </DialogHeader>

        {/* {!isCompleted && ( */}
          <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="github-url"
                className="text-sm font-medium text-diary-text"
              >
                GitHub Issue URL *
              </label>
              <Input
                id="github-url"
                type="url"
                value={issueUrl}
                onChange={(e) => setIssueUrl(e.target.value)}
                placeholder="https://github.com/username/repo/issues/123"
                className="text-sm"
                disabled={isSubmitting}
              />
              <p className="text-xs text-diary-muted">
                GitHub Issues에 등록된 블로그 글의 URL을 입력해주세요.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm whitespace-pre-line">
                  {error}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 bg-transparent"
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "제출 중..." : "제출하기"}
              </Button>
            </div>
          </form>
        {/* )} */}

        {/* {isCompleted && ( */}
          {/* <div className="p-6 pt-0">
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-700 font-medium mb-1">완료되었습니다!</p>
              <p className="text-green-600 text-sm">
                이번 달 블로그 글 작성을 완료하셨어요. 수고하셨습니다! 🎉
              </p>
            </div>
            <Button onClick={handleClose} className="w-full mt-4">
              확인
            </Button>
          </div> */}
        {/* )} */}
      </DialogContent>
    </Dialog>
  );
}
