import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'
import { Session } from '@/lib/types'
import LogoImg from '@/public/phospho-logo.svg'
import Image from 'next/image'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger
} from './ui/alert-dialog'
import { ExternalLink } from '@/components/external-link'
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog'

async function UserOrLogin() {
  const session = (await auth()) as Session
  return (
    <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.id} />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
        <Link href="/new" rel="nofollow">
          <IconNextChat className="size-6 mr-2 dark:hidden" inverted />
          <IconNextChat className="hidden size-6 mr-2 dark:block" />
        </Link>
      )}
      <div className="flex items-center">
        <IconSeparator className="size-6 text-muted-foreground/50" />
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          {/* <UserOrLogin /> */}
          <Link className="block" href="https://phospho.ai" target="_blank">
            <Image
              src={LogoImg}
              width={120}
              height={120}
              priority
              alt="phospho"
            />
          </Link>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="link">About</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>About</AlertDialogHeader>
              <AlertDialogDescription>
                This demo was built thanks to the open source AI chatbot built
                with{' '}
                <ExternalLink href="https://nextjs.org">Next.js</ExternalLink>{' '}
                and{' '}
                <ExternalLink href="https://github.com/vercel/ai">
                  Vercel AI SDK
                </ExternalLink>
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogAction>Close</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </React.Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <a
          href="https://platform.phospho.ai/"
          target="_blank"
          className={cn(buttonVariants())}
        >
          <ArrowRightIcon className="mr-2" />
          <span className="hidden sm:block">Get started with phospho</span>
        </a>
      </div>
    </header>
  )
}
