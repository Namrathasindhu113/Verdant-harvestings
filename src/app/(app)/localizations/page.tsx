
'use client';
import { useState, useTransition } from 'react';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { indianLanguages } from '@/lib/languages';
import { useLocalization } from '@/context/localization-context';
import { translateFlow } from '@/ai/flows/translate-flow';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LocalizationsPage() {
  const { t, addTranslations, translations } = useLocalization();
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const getMissingKeys = (langCode: string) => {
    const englishKeys = Object.keys(translations.en);
    const langKeys = translations[langCode] ? Object.keys(translations[langCode]) : [];
    return englishKeys.filter(key => !langKeys.includes(key) || translations[langCode][key] === key);
  };
  
  const handleTranslate = () => {
    startTransition(async () => {
      const language = indianLanguages.find(l => l.code === selectedLanguage);
      if (!language) return;

      const keysToTranslate = getMissingKeys(selectedLanguage);
      if (keysToTranslate.length === 0) {
        toast({
            title: 'No new translations needed',
            description: `All text for ${language.name} is up to date.`
        });
        return;
      }

      try {
        const result = await translateFlow({
          texts: keysToTranslate,
          targetLanguage: language.name,
        });
        addTranslations(selectedLanguage, result.translations);
        toast({
            title: 'Translations Updated!',
            description: `${keysToTranslate.length} new translations for ${language.name} have been added.`
        });
      } catch (error) {
        console.error("Translation failed", error);
        toast({
            variant: 'destructive',
            title: 'Translation Failed',
            description: 'Could not fetch translations from AI.'
        });
      }
    });
  };

  const missingKeys = getMissingKeys(selectedLanguage);
  const languageName = indianLanguages.find(l => l.code === selectedLanguage)?.name || 'selected language';

  return (
    <>
      <AppHeader title={t('Localizations')} />
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Translations</CardTitle>
            <CardDescription>
              Use AI to generate translations for different languages in the app.
              Select a language and click "Translate" to fill in missing text.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                    {indianLanguages.filter(l => l.code !== 'en').map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Button onClick={handleTranslate} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Translate with AI
                </Button>
            </div>
            
            <div className='space-y-2'>
                <h3 className="text-lg font-semibold">Missing Translations for {languageName}</h3>
                {missingKeys.length > 0 ? (
                    <Textarea 
                        readOnly
                        value={missingKeys.join('\n')}
                        rows={10}
                        className="bg-muted text-muted-foreground font-mono text-xs"
                    />
                ): (
                    <p className="text-sm text-muted-foreground p-4 text-center bg-muted rounded-md">
                        All translations for {languageName} are complete!
                    </p>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
