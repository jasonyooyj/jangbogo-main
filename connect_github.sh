#!/bin/bash

# GitHub 저장소 연결 스크립트

echo "=== GitHub 저장소 연결 ==="
echo ""

# 저장소 URL 입력
read -p "GitHub 저장소 URL을 입력하세요 (예: https://github.com/username/Hongik-main.git): " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ 저장소 URL이 입력되지 않았습니다."
    exit 1
fi

# 현재 디렉토리 확인
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo ""
echo "📁 현재 디렉토리: $SCRIPT_DIR"
echo "🔗 연결할 저장소: $repo_url"
echo ""

# Git remote 확인
if git remote -v | grep -q "origin"; then
    echo "⚠️  이미 origin이 설정되어 있습니다."
    read -p "기존 origin을 교체하시겠습니까? (y/n): " replace
    if [ "$replace" = "y" ] || [ "$replace" = "Y" ]; then
        git remote remove origin
        echo "✅ 기존 origin 제거됨"
    else
        echo "❌ 작업 취소됨"
        exit 1
    fi
fi

# Remote 추가
echo ""
echo "🔧 GitHub 저장소 연결 중..."
git remote add origin "$repo_url"

if [ $? -eq 0 ]; then
    echo "✅ 저장소 연결 성공!"
else
    echo "❌ 저장소 연결 실패"
    exit 1
fi

# 브랜치 이름 확인 및 설정
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo ""
    echo "🔧 브랜치 이름을 main으로 변경 중..."
    git branch -M main
fi

# 푸시 확인
echo ""
read -p "GitHub에 푸시하시겠습니까? (y/n): " push_confirm

if [ "$push_confirm" = "y" ] || [ "$push_confirm" = "Y" ]; then
    echo ""
    echo "📤 GitHub에 푸시 중..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 푸시 완료!"
        echo ""
        echo "🎉 GitHub 저장소 연결이 완료되었습니다!"
        echo "📝 다음 단계: Vercel에서 배포하세요 (DEPLOYMENT.md 참조)"
    else
        echo ""
        echo "❌ 푸시 실패"
        echo "💡 인증 문제일 수 있습니다. GitHub 인증을 확인하세요."
    fi
else
    echo ""
    echo "ℹ️  푸시를 건너뛰었습니다."
    echo "💡 나중에 다음 명령어로 푸시할 수 있습니다:"
    echo "   git push -u origin main"
fi

echo ""
echo "=== 완료 ==="

