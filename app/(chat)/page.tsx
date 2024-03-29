import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '../actions'
import { TextToEvents } from '@/components/text-to-events'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata = {
  title: 'phospho demo'
}

export default async function IndexPage() {
  const id = nanoid()
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  return (
    <div className="group w-full overflow-auto">
      <Tabs defaultValue="text">
        <TabsList className="flex justify-center">
          <TabsTrigger value="chat">Detect Events in chat</TabsTrigger>
          <TabsTrigger value="text">Detect Events in text</TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <TextToEvents />
        </TabsContent>
        <TabsContent value="chat">
          <AI initialAIState={{ chatId: id, messages: [] }}>
            <Chat id={id} session={session} missingKeys={missingKeys} />
          </AI>
        </TabsContent>
      </Tabs>
    </div>
  )
}
