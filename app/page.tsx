"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, RefreshCw, Check, Sparkles, User, Key, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

type GeneratedItem = {
  id: string
  username: string
  password: string
}

export default function PasswordGenerator() {
  const { toast } = useToast()
  const [items, setItems] = useState<GeneratedItem[]>([])
  const [passwordLength, setPasswordLength] = useState(12)
  const [quantity, setQuantity] = useState(5)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")

  // Generate passwords on initial load
  useEffect(() => {
    generateItems()
  }, [])

  const generatePassword = (length: number): string => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const uppercase = includeUppercase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : ""
    const numbers = includeNumbers ? "0123456789" : ""
    const symbols = includeSymbols ? "!@#$%^&*()_+-=[]{}|;:,.<>?" : ""

    const allChars = lowercase + uppercase + numbers + symbols

    let password = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length)
      password += allChars[randomIndex]
    }

    return password
  }

  const generateUsername = (): string => {
    const adjectives = [
      "Cool",
      "Super",
      "Mega",
      "Ultra",
      "Hyper",
      "Cyber",
      "Digital",
      "Quantum",
      "Cosmic",
      "Epic",
      "Neon",
      "Pixel",
      "Tech",
      "Glitch",
      "Swift",
    ]
    const nouns = [
      "Dragon",
      "Tiger",
      "Phoenix",
      "Eagle",
      "Wolf",
      "Panda",
      "Ninja",
      "Samurai",
      "Wizard",
      "Knight",
      "Ranger",
      "Hunter",
      "Coder",
      "Hacker",
      "Gamer",
    ]

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
    const randomNumber = Math.floor(Math.random() * 1000)

    return `${randomAdjective}${randomNoun}${randomNumber}`
  }

  const generateItems = async () => {
    setIsGenerating(true)

    // Simulate a slight delay for the animation effect
    await new Promise((resolve) => setTimeout(resolve, 300))

    const newItems: GeneratedItem[] = []

    for (let i = 0; i < quantity; i++) {
      newItems.push({
        id: crypto.randomUUID(),
        username: generateUsername(),
        password: generatePassword(passwordLength),
      })
    }

    setItems(newItems)
    setIsGenerating(false)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)

    setTimeout(() => {
      setCopiedId(null)
    }, 2000)

    toast({
      title: "已复制到剪贴板",
      description: "内容已成功复制",
      duration: 2000,
    })
  }

  const copyAllToClipboard = () => {
    const allText = items.map((item) => `用户名: ${item.username} | 密码: ${item.password}`).join("\n")
    navigator.clipboard.writeText(allText)

    toast({
      title: "批量复制成功",
      description: `已复制 ${items.length} 组账号密码到剪贴板`,
      duration: 2000,
    })
  }

  const downloadAsCSV = () => {
    const csvContent = ["Username,Password", ...items.map((item) => `${item.username},${item.password}`)].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "accounts.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "下载成功",
      description: "账号密码已保存为CSV文件",
      duration: 2000,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            <span className="inline-block">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block"
              >
                账号密码
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="inline-block ml-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500"
              >
                生成器
              </motion.span>
            </span>
          </h1>
          <p className="text-gray-300 text-lg">安全、快速、酷炫的在线账号密码生成工具</p>
        </motion.div>

        <Tabs defaultValue="generate" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="generate">生成设置</TabsTrigger>
            <TabsTrigger value="results">生成结果</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Card className="backdrop-blur-md bg-white/10 border-none text-white shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-pink-400" />
                    生成选项
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password-length" className="text-sm font-medium">
                        密码长度: {passwordLength}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {passwordLength < 8 ? "弱" : passwordLength < 12 ? "中" : "强"}
                      </Badge>
                    </div>
                    <Slider
                      id="password-length"
                      min={6}
                      max={24}
                      step={1}
                      value={[passwordLength]}
                      onValueChange={(value) => setPasswordLength(value[0])}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-sm font-medium">
                      生成数量: {quantity}
                    </Label>
                    <Slider
                      id="quantity"
                      min={1}
                      max={20}
                      step={1}
                      value={[quantity]}
                      onValueChange={(value) => setQuantity(value[0])}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="include-numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                      <Label htmlFor="include-numbers">包含数字</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="include-symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                      <Label htmlFor="include-symbols">包含符号</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="include-uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                      <Label htmlFor="include-uppercase">包含大写字母</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={generateItems}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white"
                  >
                    {isGenerating ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    生成账号密码
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="results">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <Card className="backdrop-blur-md bg-white/10 border-none text-white shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl">生成结果</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyAllToClipboard}
                      className="text-xs bg-white/10 hover:bg-white/20 border-none"
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      批量复制
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadAsCSV}
                      className="text-xs bg-white/10 hover:bg-white/20 border-none"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      下载CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center items-center py-12"
                      >
                        <div className="flex flex-col items-center">
                          <RefreshCw className="h-8 w-8 animate-spin text-pink-400" />
                          <p className="mt-4 text-gray-300">生成中...</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        {items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className="relative"
                          >
                            <Card
                              className={cn(
                                "backdrop-blur-md bg-white/5 border-none hover:bg-white/10 transition-all duration-300",
                                index % 2 === 0 ? "border-l-4 border-l-pink-500" : "border-l-4 border-l-violet-500",
                              )}
                            >
                              <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <div className="flex items-center text-xs text-gray-400">
                                      <User className="h-3 w-3 mr-1" />
                                      用户名
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <code className="bg-black/20 px-2 py-1 rounded text-sm font-mono flex-1 truncate">
                                        {item.username}
                                      </code>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 ml-1"
                                        onClick={() => copyToClipboard(item.username, `username-${item.id}`)}
                                      >
                                        {copiedId === `username-${item.id}` ? (
                                          <Check className="h-4 w-4 text-green-400" />
                                        ) : (
                                          <Copy className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex items-center text-xs text-gray-400">
                                      <Key className="h-3 w-3 mr-1" />
                                      密码
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <code className="bg-black/20 px-2 py-1 rounded text-sm font-mono flex-1 truncate">
                                        {item.password}
                                      </code>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 ml-1"
                                        onClick={() => copyToClipboard(item.password, `password-${item.id}`)}
                                      >
                                        {copiedId === `password-${item.id}` ? (
                                          <Check className="h-4 w-4 text-green-400" />
                                        ) : (
                                          <Copy className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Particle effect when hovering */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="absolute w-1 h-1 rounded-full bg-pink-400"
                                  initial={{ opacity: 0, scale: 0 }}
                                  whileInView={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                    x: [0, Math.random() * 100 - 50],
                                    y: [0, Math.random() * 100 - 50],
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    delay: i * 0.2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatDelay: 3,
                                  }}
                                  style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                  }}
                                />
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={generateItems}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white"
                  >
                    {isGenerating ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    重新生成
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Floating particles for background effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0],
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
              }}
              transition={{
                duration: 5,
                delay: i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: Math.random() * 5,
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
